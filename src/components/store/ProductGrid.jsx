import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

import ProductCard, { ProductCardSkeleton } from "./ProductCard";

const gridClassName = "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4";

/**
 * Product grid with the three list states from the design spec:
 * skeleton while loading, error + retry, and empty + optional reset.
 */
export default function ProductGrid({
  products,
  loading,
  error,
  onRetry,
  onReset,
  skeletonCount = 8,
}) {
  if (loading) {
    return (
      <div className={gridClassName} aria-busy="true">
        {Array.from({ length: skeletonCount }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={onRetry} />;
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
        <SearchX className="size-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Không tìm thấy sản phẩm phù hợp</p>
        {onReset ? (
          <Button variant="outline" onClick={onReset}>
            Xoá bộ lọc
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border py-16 text-center">
      <p className="text-sm text-destructive">{message}</p>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          Thử lại
        </Button>
      ) : null}
    </div>
  );
}
