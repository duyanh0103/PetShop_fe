import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import ProductGrid from "@/components/store/ProductGrid";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { usePublicCategories, usePublicProducts } from "./hooks/useStoreCatalog";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
  { value: "name_asc", label: "Tên A–Z" },
];

function CategoryFilter({ categories, selected, onSelect }) {
  const options = [{ slug: "", name: "Tất cả" }, ...categories];

  return (
    <nav aria-label="Lọc theo danh mục">
      {/* Mobile: horizontal chips. Desktop: vertical list. */}
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
        {options.map((category) => {
          const isActive = category.slug === selected;

          return (
            <li key={category.slug || "all"} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect(category.slug)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "w-full rounded-full border px-3 py-1.5 text-left text-sm transition-colors lg:rounded-lg lg:border-transparent",
                  isActive
                    ? "border-foreground bg-foreground text-background lg:bg-muted lg:text-foreground lg:font-medium"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {category.name}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SimplePagination({ page, totalPages, onPageChange }) {
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

export default function ProductList() {
  // Filters live in the URL so a refresh or a shared link keeps them.
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "";
  const search = searchParams.get("search") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const { categories } = usePublicCategories();
  const { products, pagination, loading, error, refetch } = usePublicProducts({
    categorySlug: category,
    search,
    sort,
    page,
    limit: PAGE_SIZE,
  });

  // Changing any filter resets to page 1 (page is simply dropped from the URL).
  const updateParams = (changes) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });

    if (!("page" in changes)) next.delete("page");
    setSearchParams(next);
  };

  const activeCategory = categories.find((item) => item.slug === category);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{activeCategory?.name ?? "Sản phẩm"}</h1>
          {!loading && !error ? (
            <p className="text-sm text-muted-foreground">{pagination.total} sản phẩm</p>
          ) : null}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Sắp xếp</span>
          <Select value={sort} onValueChange={(value) => updateParams({ sort: value === "newest" ? "" : value })}>
            <SelectTrigger className="w-40" aria-label="Sắp xếp">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {search ? (
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted py-1 pr-1 pl-3 text-sm">
            Kết quả cho “{search}”
            <button
              type="button"
              onClick={() => updateParams({ search: "" })}
              className="rounded-full p-1 hover:bg-background"
              aria-label="Xoá từ khoá tìm kiếm"
            >
              <X className="size-3.5" />
            </button>
          </span>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <aside>
          <CategoryFilter
            categories={categories}
            selected={category}
            onSelect={(slug) => updateParams({ category: slug })}
          />
        </aside>

        <div className="space-y-6">
          <ProductGrid
            products={products}
            loading={loading}
            error={error}
            onRetry={refetch}
            onReset={category || search ? () => setSearchParams({}) : undefined}
            skeletonCount={PAGE_SIZE}
          />
          <SimplePagination
            page={page}
            totalPages={pagination.totalPages}
            onPageChange={(nextPage) => updateParams({ page: nextPage > 1 ? String(nextPage) : "" })}
          />
        </div>
      </div>
    </div>
  );
}
