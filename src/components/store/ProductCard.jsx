import { PawPrint } from "lucide-react";
import { Link } from "react-router-dom";

import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function ProductCard({ product }) {
  const outOfStock = !product.inStock;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className={cn(
              "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
              outOfStock && "opacity-60"
            )}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <PawPrint className="size-12" />
          </div>
        )}

        {outOfStock ? (
          <span className="absolute top-2 left-2 rounded-md bg-foreground/80 px-2 py-0.5 text-xs font-medium text-background">
            Hết hàng
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        {product.category ? (
          <span className="text-xs text-muted-foreground">{product.category.name}</span>
        ) : null}
        <h3 className="line-clamp-2 text-sm font-medium text-foreground">{product.name}</h3>
        <p className="mt-auto pt-1 text-base font-semibold text-foreground">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-xl border border-border">
      <div className="aspect-square bg-muted" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-1/3 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
      </div>
    </div>
  );
}
