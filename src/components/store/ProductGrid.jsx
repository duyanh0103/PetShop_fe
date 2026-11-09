import { SearchX } from "lucide-react";

import PawIcon from "@/components/brand/PawIcon";
import { Button } from "@/components/ui/button";

import ProductCard, { ProductCardSkeleton } from "./ProductCard";

const gridClassName = "grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3.5";

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
    return <ErrorState title="Không tải được sản phẩm" message={error.message} onRetry={onRetry} />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="size-7" />}
        title="Không tìm thấy sản phẩm phù hợp"
        message="Thử từ khoá khác hoặc bỏ bớt bộ lọc nhé."
        action={
          onReset ? (
            <Button variant="secondary" onClick={onReset}>
              Xoá bộ lọc
            </Button>
          ) : null
        }
      />
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

export function EmptyState({ icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center gap-2.5 rounded-[20px] border-[1.5px] border-border bg-card px-5 py-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-pastel text-primary">
        {icon ?? <PawIcon size={30} />}
      </div>
      <p className="font-heading text-[22px] font-extrabold">{title}</p>
      {message ? <p className="text-muted-foreground">{message}</p> : null}
      {action}
    </div>
  );
}

export function ErrorState({ title = "Không tải được dữ liệu", message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-2.5 rounded-[20px] border-[1.5px] border-[#f3c4c8] bg-danger-soft px-5 py-12 text-center dark:border-[#6b2e3a]"
    >
      <p className="font-bold text-danger-text">{title}</p>
      {message ? <p className="text-sm text-body">{message}</p> : null}
      {onRetry ? (
        <Button variant="outline-destructive" onClick={onRetry}>
          Thử lại
        </Button>
      ) : null}
    </div>
  );
}
