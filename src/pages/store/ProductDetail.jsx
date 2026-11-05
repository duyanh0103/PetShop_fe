import { useEffect, useState } from "react";
import { Check, PawPrint, ShoppingCart } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { ErrorState } from "@/components/store/ProductGrid";
import QuantityPicker from "@/components/store/QuantityPicker";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import useCartStore from "@/store/cartStore";

import { usePublicProduct } from "./hooks/useStoreCatalog";

function DetailSkeleton() {
  return (
    <div className="grid animate-pulse gap-8 md:grid-cols-2">
      <div className="aspect-square rounded-2xl bg-muted" />
      <div className="space-y-4">
        <div className="h-8 w-3/4 rounded bg-muted" />
        <div className="h-4 w-1/4 rounded bg-muted" />
        <div className="h-8 w-1/3 rounded bg-muted" />
        <div className="h-24 rounded bg-muted" />
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
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-muted-foreground">Sản phẩm không tồn tại hoặc đã ngừng kinh doanh</p>
        <Button asChild variant="outline">
          <Link to="/products">Về trang sản phẩm</Link>
        </Button>
      </div>
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
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/" className="hover:text-foreground">
              Trang chủ
            </Link>
          </li>
          {product.category ? (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link to={`/products?category=${product.category.slug}`} className="hover:text-foreground">
                  {product.category.name}
                </Link>
              </li>
            </>
          ) : null}
          <li aria-hidden="true">/</li>
          <li className="line-clamp-1 text-foreground" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <PawPrint className="size-20" />
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold sm:text-3xl">{product.name}</h1>
            <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
          </div>

          <p className="text-3xl font-bold">{formatPrice(product.price)}</p>

          <p className={product.inStock ? "text-sm text-green-700 dark:text-green-400" : "text-sm font-medium text-destructive"}>
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

            <Button size="lg" onClick={handleAddToCart} disabled={remaining === 0}>
              {justAdded ? <Check data-icon="inline-start" /> : <ShoppingCart data-icon="inline-start" />}
              {!product.inStock ? "Hết hàng" : justAdded ? "Đã thêm vào giỏ" : "Thêm vào giỏ"}
            </Button>

            {inCart > 0 ? (
              <Link to="/cart" className="text-sm font-medium underline-offset-4 hover:underline">
                Xem giỏ hàng ({inCart})
              </Link>
            ) : null}
          </div>

          {atCartLimit ? (
            <p className="text-sm text-muted-foreground">Đã đạt số lượng tối đa trong giỏ</p>
          ) : null}

          {product.description ? (
            <div className="space-y-2 border-t border-border pt-5">
              <h2 className="font-semibold">Mô tả sản phẩm</h2>
              <p className="text-sm whitespace-pre-line text-muted-foreground">{product.description}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
