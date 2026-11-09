import { useSearchParams } from "react-router-dom";

import SimplePagination from "@/components/store/SimplePagination";
import ProductGrid from "@/components/store/ProductGrid";
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
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {options.map((category) => {
          const isActive = category.slug === selected;

          return (
            <li key={category.slug || "all"} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect(category.slug)}
                aria-pressed={isActive}
                className={cn(
                  "h-10 rounded-full border-[1.5px] px-4 text-sm font-bold transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-card text-foreground hover:bg-muted"
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

  const title = search ? `Kết quả cho “${search}”` : (activeCategory?.name ?? "Sản phẩm");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[34px]">{title}</h1>
          {!loading && !error ? (
            <p className="mt-1 text-muted-foreground">
              {pagination.total} sản phẩm
              {search ? (
                <>
                  {" · "}
                  <button
                    type="button"
                    onClick={() => updateParams({ search: "" })}
                    className="font-bold text-primary hover:underline"
                  >
                    Xoá từ khoá
                  </button>
                </>
              ) : null}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <span id="sort-label" className="text-sm font-bold">
            Sắp xếp
          </span>
          <Select value={sort} onValueChange={(value) => updateParams({ sort: value === "newest" ? "" : value })}>
            <SelectTrigger className="w-44 rounded-full" aria-labelledby="sort-label">
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

      <CategoryFilter
        categories={categories}
        selected={category}
        onSelect={(slug) => updateParams({ category: slug })}
      />

      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onRetry={refetch}
        onReset={category || search ? () => setSearchParams({}) : undefined}
        skeletonCount={PAGE_SIZE}
      />
      <SimplePagination
        className="mt-3"
        page={page}
        totalPages={pagination.totalPages}
        onPageChange={(nextPage) => updateParams({ page: nextPage > 1 ? String(nextPage) : "" })}
      />
    </div>
  );
}
