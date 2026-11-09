import { ChevronLeft, ChevronRight } from "lucide-react";

import { pageItems } from "@/lib/pagination";
import { cn } from "@/lib/utils";

const itemClassName =
  "inline-flex size-11 items-center justify-center rounded-xl border-[1.5px] border-border bg-card font-bold text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40";

export default function SimplePagination({ page, totalPages, onPageChange, className }) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Phân trang" className={cn("flex flex-wrap justify-center gap-2", className)}>
      <button
        type="button"
        className={itemClassName}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Trang trước"
      >
        <ChevronLeft className="size-4" />
      </button>
      {pageItems(page, totalPages).map((item) =>
        typeof item === "string" ? (
          <span key={item} className="inline-flex size-11 items-center justify-center text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(itemClassName, item === page && "border-foreground bg-foreground text-background hover:bg-foreground")}
          >
            {item}
          </button>
        )
      )}
      <button
        type="button"
        className={itemClassName}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Trang sau"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
