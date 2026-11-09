import { ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import OrderSummary from "@/components/store/OrderSummary";
import PawIcon from "@/components/brand/PawIcon";
import { EmptyState, ErrorState } from "@/components/store/ProductGrid";
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
    <li
      className={cn(
        "flex flex-col gap-2.5 rounded-[20px] border-[1.5px] bg-card p-3.5",
        insufficient ? "border-warning-border" : unavailable ? "border-[#c9d1dc]" : "border-border"
      )}
    >
      <div className="flex items-start gap-3.5">
        <Link
          to={`/products/${item.productId}`}
          aria-label={item.name}
          className={cn("size-[84px] shrink-0 overflow-hidden rounded-[14px] bg-tile", unavailable && "opacity-45")}
        >
          {item.imageUrl ? (
            <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-tile-icon">
              <PawIcon size={32} />
            </div>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Link to={`/products/${item.productId}`} className="leading-snug font-bold text-foreground hover:underline">
            {item.name}
          </Link>
          {line && !unavailable ? (
            <span className="text-sm text-muted-foreground">{formatPrice(line.unitPrice)} / sản phẩm</span>
          ) : null}
          <div className="mt-1 flex flex-wrap items-center justify-between gap-2.5">
            {unavailable ? null : (
              <QuantityPicker
                size="sm"
                value={item.quantity}
                max={Math.max(line?.available ?? item.quantity, item.quantity)}
                onChange={(next) => onQuantityChange(item.productId, next)}
              />
            )}
            <span className="ml-auto text-[17px] font-extrabold text-primary">
              {unavailable ? "—" : formatPrice(line?.lineTotal)}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-status-locked hover:text-danger-text"
          onClick={() => onRemove(item.productId)}
          aria-label={`Xoá ${item.name} khỏi giỏ`}
        >
          <Trash2 className="size-5" />
        </Button>
      </div>

      {insufficient ? (
        <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl bg-warning-soft px-3 py-2.5 text-sm font-bold text-warning-text">
          Chỉ còn {line.available} sản phẩm trong kho
          <Button
            variant="outline"
            size="sm"
            className="border-warning-border bg-card text-warning-text hover:bg-warning-soft"
            onClick={() => onQuantityChange(item.productId, line.available)}
          >
            Giảm về {line.available}
          </Button>
        </div>
      ) : null}

      {unavailable ? (
        <div className="rounded-xl bg-status-cancelled px-3 py-2.5 text-sm font-bold text-status-cancelled-foreground">
          Sản phẩm không còn bán — hãy xoá khỏi giỏ để đặt hàng
        </div>
      ) : null}
    </li>
  );
}

function CartSkeleton() {
  return (
    <div className="flex flex-wrap items-start gap-6" aria-busy="true">
      <div className="skeleton h-64 min-w-0 flex-[999_1_560px] rounded-[20px]" />
      <div className="skeleton h-72 flex-[1_1_320px] rounded-3xl" />
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
      <div className="flex flex-col gap-5">
        <h1 className="text-[34px]">Giỏ hàng</h1>
        <EmptyState
          icon={<ShoppingCart className="size-7" />}
          title="Giỏ đang trống trơn"
          message="Cục Meow đói rồi nè!"
          action={
            <Button asChild>
              <Link to="/products">Mua sắm ngay</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (error && !quote) return <ErrorState title="Không tính được tiền giỏ hàng" message={error.message} onRetry={refetch} />;
  if (!quote) return <CartSkeleton />;

  const lineById = new Map(quote.items.map((line) => [line.productId, line]));
  const hasProblem = !quote.canCheckout;
  const isAdmin = isAdminRole(user?.role);
  const amountToFreeShipping = quote.freeShippingThreshold - quote.subtotal;

  const freeShippingProgress = Math.min(100, Math.round((quote.subtotal / quote.freeShippingThreshold) * 100));

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-[34px]">Giỏ hàng ({count})</h1>

      <div className="flex flex-wrap items-start gap-6">
        <ul className="flex min-w-0 flex-[999_1_560px] flex-col gap-3">
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

        <aside className="flex flex-[1_1_320px] flex-col gap-3 rounded-3xl border-[1.5px] border-border bg-card p-5 lg:sticky lg:top-24">
          <h2 className="text-[22px]">Tổng đơn</h2>

          {quote.shippingFee > 0 && amountToFreeShipping > 0 ? (
            <div className="flex flex-col gap-2 rounded-[14px] bg-muted p-3 text-sm">
              <span>
                Mua thêm <b>{formatPrice(amountToFreeShipping)}</b> để được <b>miễn phí vận chuyển</b>
              </span>
              <div
                className="h-2 overflow-hidden rounded-full bg-pastel"
                role="progressbar"
                aria-label="Tiến độ tới mức miễn phí vận chuyển"
                aria-valuenow={freeShippingProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="h-full rounded-full bg-primary" style={{ width: `${freeShippingProgress}%` }} />
              </div>
            </div>
          ) : null}

          <OrderSummary subtotal={quote.subtotal} shippingFee={quote.shippingFee} total={quote.total} />

          {error ? <ErrorState title="Không tính được tiền giỏ hàng" message={error.message} onRetry={refetch} /> : null}

          {hasProblem && !updating ? (
            <p className="text-[13px] font-bold text-danger-text">Xử lý các dòng được đánh dấu trước khi đặt hàng.</p>
          ) : null}

          {isAdmin ? (
            <p className="text-sm text-muted-foreground">
              Tài khoản quản trị không thể đặt hàng. Vui lòng dùng tài khoản khách hàng.
            </p>
          ) : hasProblem || updating || error ? (
            <Button size="lg" className="w-full text-[17px]" disabled>
              Đặt hàng
            </Button>
          ) : (
            <Button asChild size="lg" className="w-full text-[17px]">
              <Link to="/checkout">Đặt hàng</Link>
            </Button>
          )}
          <p className="text-center text-[13px] text-muted-foreground">Thanh toán khi nhận hàng (COD)</p>
        </aside>
      </div>
    </div>
  );
}
