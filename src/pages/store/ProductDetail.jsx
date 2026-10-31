import { useState } from "react";
import { Minus, PawPrint, Plus, ShoppingCart } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { ErrorState } from "@/components/store/ProductGrid";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatPrice } from "@/lib/format";

import { usePublicProduct } from "./hooks/useStoreCatalog";

function QuantityPicker({ value, max, onChange }) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border">
      <Button
        variant="ghost"
        size="icon-lg"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Giảm số lượng"
      >
        <Minus />
      </Button>
      <span className="w-10 text-center text-sm font-medium" aria-live="polite">
        {value}
      </span>
      <Button
        variant="ghost"
        size="icon-lg"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Tăng số lượng"
      >
        <Plus />
      </Button>
    </div>
  );
}

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
            {product.inStock ? (
              <QuantityPicker
                value={quantity}
                max={product.quantity}
                onChange={(next) => setQuantity(Math.min(Math.max(next, 1), product.quantity))}
              />
            ) : null}

            {/* Cart arrives in Sprint 2; the button is shown but disabled until then. */}
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0}>
                    <Button size="lg" disabled>
                      <ShoppingCart data-icon="inline-start" />
                      {product.inStock ? "Thêm vào giỏ" : "Hết hàng"}
                    </Button>
                  </span>
                </TooltipTrigger>
                {product.inStock ? <TooltipContent>Sắp ra mắt</TooltipContent> : null}
              </Tooltip>
            </TooltipProvider>
          </div>

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
