import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import PawIcon from "@/components/brand/PawIcon";
import { EmptyState, ErrorState } from "@/components/store/ProductGrid";
import QuantityPicker from "@/components/store/QuantityPicker";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import useCartStore from "@/store/cartStore";

import { usePublicProduct } from "./hooks/useStoreCatalog";
import { imageUrl } from "@/lib/image";

function DetailSkeleton() {
  return (
    <div className="flex flex-wrap gap-8" aria-busy="true">
      <div className="skeleton aspect-square max-w-[520px] flex-[1_1_380px] rounded-[28px]" />
      <div className="flex flex-[1_1_380px] flex-col gap-4">
        <div className="skeleton h-7 w-20 rounded-full" />
        <div className="skeleton h-9 w-3/4" />
        <div className="skeleton h-4 w-1/4" />
        <div className="skeleton h-10 w-1/3" />
        <div className="skeleton h-32 rounded-[20px]" />
      </div>
    </div>
  );
}

// Keyed by id so per-product state (chosen quantity) resets on navigation.
export default function ProductDetail() {
  const { id } = useParams();
  return <ProductDetailContent key={id} id={id} />;
}

function ProductDetailContent({ id }) {
  const { product, loading, error, refetch } = usePublicProduct(id);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const inCart = useCartStore(
    (state) => state.items.find((item) => item.productId === id)?.quantity ?? 0
  );
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!justAdded) return undefined;
    const timer = setTimeout(() => setJustAdded(false), 2000);
    return () => clearTimeout(timer);
  }, [justAdded]);

  if (loading) return <DetailSkeleton />;

  if (error?.status === 404) {
    return (
      <EmptyState
        title="Sản phẩm không tồn tại hoặc đã ngừng bán"
        message="Có thể shop vừa cập nhật lại danh sách. Mình xem các món khác nhé."
        action={
          <Button asChild>
            <Link to="/products">Về trang sản phẩm</Link>
          </Button>
        }
      />
    );
  }

  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  // Stock still available to add once what is already in the cart is counted.
  const remaining = Math.max(product.quantity - inCart, 0);
  const atCartLimit = product.inStock && remaining === 0;
  const pickerValue = Math.min(quantity, Math.max(remaining, 1));

  const handleAddToCart = () => {
    addItem(product, pickerValue);
    setQuantity(1);
    setJustAdded(true);
  };

  return (
    <div className="flex flex-col gap-5">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/" className="text-primary hover:underline">
              Trang chủ
            </Link>
          </li>
          {product.category ? (
            <>
              <li aria-hidden="true">›</li>
              <li>
                <Link to={`/products?category=${product.category.slug}`} className="text-primary hover:underline">
                  {product.category.name}
                </Link>
              </li>
            </>
          ) : null}
          <li aria-hidden="true">›</li>
          <li className="line-clamp-1 font-bold text-foreground" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="flex flex-wrap items-start gap-8">
        <div className="aspect-square w-full max-w-[520px] flex-[1_1_380px] overflow-hidden rounded-[28px] bg-pastel">
          {product.imageUrl ? (
            <img src={imageUrl(product.imageUrl, 900)} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#8cc2fa]">
              <PawIcon size={120} />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-4">
          {product.category ? (
            <span className="self-start rounded-full bg-status-pending px-3 py-1 text-[13px] font-extrabold text-status-pending-foreground">
              {product.category.name}
            </span>
          ) : null}
          <h1 className="text-[28px] sm:text-[34px]">{product.name}</h1>
          <p className="text-sm text-muted-foreground">
            SKU: <b className="text-foreground">{product.sku}</b>
          </p>

          <p className="font-heading text-4xl font-extrabold text-primary">{formatPrice(product.price)}</p>

          <p className="flex items-center gap-2 font-bold">
            <span
              aria-hidden="true"
              className={product.inStock ? "size-2 rounded-full bg-success" : "size-2 rounded-full bg-destructive"}
            />
            {product.inStock ? `Còn ${product.quantity} sản phẩm` : "Hết hàng"}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {remaining > 0 ? (
              <QuantityPicker
                value={pickerValue}
                max={remaining}
                onChange={(next) => setQuantity(Math.min(Math.max(next, 1), remaining))}
              />
            ) : null}

            <Button size="lg" className="flex-[1_1_200px]" onClick={handleAddToCart} disabled={remaining === 0}>
              {!product.inStock ? "Hết hàng" : "Thêm vào giỏ"}
            </Button>

            <Button asChild size="lg" variant="outline">
              <Link to="/cart">Xem giỏ hàng{inCart > 0 ? ` (${inCart})` : ""}</Link>
            </Button>
          </div>

          {justAdded ? (
            <div
              role="status"
              className="flex items-center gap-2.5 rounded-[14px] bg-[#13306e] px-4 py-3 font-bold text-white"
            >
              <Check className="size-5 text-highlight" aria-hidden="true" />
              Đã thêm vào giỏ
            </div>
          ) : null}

          {atCartLimit ? (
            <p className="text-sm text-muted-foreground">Đã đạt số lượng tối đa trong giỏ</p>
          ) : null}

          {product.description ? (
            <div className="rounded-[20px] border-[1.5px] border-border bg-card p-5">
              <h2 className="mb-2 text-xl">Mô tả</h2>
              <p className="leading-relaxed whitespace-pre-line text-body">{product.description}</p>
            </div>
          ) : null}

          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5 text-sm">
            <div className="rounded-[14px] bg-muted p-3">
              <b>Thanh toán khi nhận hàng</b>
            </div>
            <div className="rounded-[14px] bg-muted p-3">
              <b>Freeship đơn từ 500.000 ₫</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
