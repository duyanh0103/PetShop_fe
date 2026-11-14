import { Link } from "react-router-dom";

import PawIcon from "@/components/brand/PawIcon";
import StatusBadge from "@/components/common/StatusBadge";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { imageUrl } from "@/lib/image";

export default function ProductCard({ product }) {
  const outOfStock = !product.inStock;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col gap-1.5 rounded-[20px] border-[1.5px] border-border bg-card p-2.5 text-foreground transition-colors hover:border-[#8cc2fa] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <div className="relative aspect-square overflow-hidden rounded-[14px] bg-tile">
        {product.imageUrl ? (
          <img
            src={imageUrl(product.imageUrl, 400)}
            alt={product.name}
            loading="lazy"
            className={cn(
              "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
              outOfStock && "opacity-45"
            )}
          />
        ) : (
          <div className={cn("flex h-full w-full items-center justify-center text-tile-icon", outOfStock && "opacity-45")}>
            <PawIcon size={44} />
          </div>
        )}

        {outOfStock ? (
          <StatusBadge tone="oos" dot={false} className="absolute bottom-2 left-2 text-xs">
            Hết hàng
          </StatusBadge>
        ) : null}
      </div>

      {product.categories?.length || product.category ? (
        <span className="line-clamp-1 text-xs font-bold text-muted-foreground">
          {(product.categories?.length ? product.categories : [product.category]).map((category) => category.name).join(" · ")}
        </span>
      ) : null}
      <h3 className="line-clamp-2 min-h-10 font-sans text-[15px] leading-[1.35] font-bold">{product.name}</h3>
      <p className="mt-auto text-base font-extrabold text-primary">{formatPrice(product.price)}</p>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 rounded-[20px] border-[1.5px] border-border bg-card p-2.5">
      <div className="skeleton aspect-square rounded-[14px]" />
      <div className="skeleton h-3.5 w-1/2" />
      <div className="skeleton h-3.5" />
      <div className="skeleton h-3.5 w-2/5" />
    </div>
  );
}
