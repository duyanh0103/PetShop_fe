import { PawPrint, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import OrderSummary from "@/components/store/OrderSummary";
import { ErrorState } from "@/components/store/ProductGrid";
import QuantityPicker from "@/components/store/QuantityPicker";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { isAdminRole } from "@/lib/roles";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import useCartStore, { selectCartCount } from "@/store/cartStore";

import useCartQuote from "./hooks/useCartQuote";

function CartLine({ item, line, onQuantityChange, onRemove }) {
  const unavailable = line?.status === "UNAVAILABLE";
  const insufficient = line?.status === "INSUFFICIENT";

  return (
    <li className="flex gap-3 p-3 sm:gap-4 sm:p-4">
      <Link
        to={`/products/${item.productId}`}
        className={cn("size-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-24", unavailable && "opacity-50")}
      >
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <PawPrint className="size-8" />
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/products/${item.productId}`}
            className={cn("line-clamp-2 text-sm font-medium hover:underline", unavailable && "text-muted-foreground")}
          >
            {item.name}
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemove(item.productId)}
            aria-label={`Xoá ${item.name} khỏi giỏ`}
          >
            <Trash2 />
          </Button>
        </div>

        {unavailable ? (
          <p className="text-sm text-destructive">Sản phẩm không còn bán</p>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <QuantityPicker
              value={item.quantity}
              max={Math.max(line?.available ?? item.quantity, item.quantity)}
              onChange={(next) => onQuantityChange(item.productId, next)}
            />
            <div className="text-right">
              <p className="text-sm font-semibold">{formatPrice(line?.lineTotal)}</p>
              <p className="text-xs text-muted-foreground">{formatPrice(line?.unitPrice)} / sản phẩm</p>
            </div>
          </div>
        )}

        {insufficient ? (
          <p className="flex flex-wrap items-center gap-2 text-sm text-destructive">
            Chỉ còn {line.available} sản phẩm
            <Button variant="outline" size="xs" onClick={() => onQuantityChange(item.productId, line.available)}>
              Giảm về {line.available}
            </Button>
          </p>
        ) : null}
      </div>
    </li>
  );
}

function CartSkeleton() {
  return (
    <div className="grid animate-pulse gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="h-64 rounded-xl bg-muted" />
      <div className="h-48 rounded-xl bg-muted" />
    </div>
  );
}

export default function Cart() {
  const items = useCartStore((state) => state.items);
  const count = useCartStore(selectCartCount);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const user = useAuthStore((state) => state.user);
  const { quote, updating, error, refetch } = useCartQuote(items);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <ShoppingCart className="size-12 text-muted-foreground" />
        <p className="text-muted-foreground">Giỏ hàng đang trống</p>
        <Button asChild>
          <Link to="/products">Mua sắm ngay</Link>
        </Button>
      </div>
    );
  }

  if (error && !quote) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!quote) return <CartSkeleton />;

  const lineById = new Map(quote.items.map((line) => [line.productId, line]));
  const hasProblem = !quote.canCheckout;
  const isAdmin = isAdminRole(user?.role);
  const amountToFreeShipping = quote.freeShippingThreshold - quote.subtotal;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Giỏ hàng ({count})</h1>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
        <ul className="divide-y divide-border rounded-xl border border-border">
          {items.map((item) => (
            <CartLine
              key={item.productId}
              item={item}
              line={lineById.get(item.productId)}
              onQuantityChange={setQuantity}
              onRemove={removeItem}
            />
          ))}
        </ul>

        <aside className="space-y-4 rounded-xl border border-border p-4 lg:sticky lg:top-20">
          <OrderSummary subtotal={quote.subtotal} shippingFee={quote.shippingFee} total={quote.total} />

          {quote.shippingFee > 0 && amountToFreeShipping > 0 ? (
            <p className="text-sm text-muted-foreground">
              Mua thêm {formatPrice(amountToFreeShipping)} để được miễn phí vận chuyển
            </p>
          ) : null}

          {error ? <ErrorState message={error.message} onRetry={refetch} /> : null}

          {hasProblem && !updating ? (
            <p className="text-sm text-destructive">Vui lòng xử lý các sản phẩm được đánh dấu trước khi đặt hàng.</p>
          ) : null}

          {isAdmin ? (
            <p className="text-sm text-muted-foreground">
              Tài khoản quản trị không thể đặt hàng. Vui lòng dùng tài khoản khách hàng.
            </p>
          ) : hasProblem || updating || error ? (
            <Button size="lg" className="w-full" disabled>
              Đặt hàng
            </Button>
          ) : (
            <Button asChild size="lg" className="w-full">
              <Link to="/checkout">Đặt hàng</Link>
            </Button>
          )}
        </aside>
      </div>
    </div>
  );
}
