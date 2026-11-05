import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function SimplePagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Trang trước"
      >
        <ChevronLeft />
        Trước
      </Button>
      <span className="px-2 text-sm text-muted-foreground">
        Trang {page} / {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Trang sau"
      >
        Sau
        <ChevronRight />
      </Button>
    </div>
  );
}
