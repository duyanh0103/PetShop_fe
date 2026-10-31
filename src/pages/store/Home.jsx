import { ArrowRight, PawPrint } from "lucide-react";
import { Link } from "react-router-dom";

import ProductGrid, { ErrorState } from "@/components/store/ProductGrid";
import { Button } from "@/components/ui/button";

import { usePublicCategories, usePublicProducts } from "./hooks/useStoreCatalog";

const NEWEST_PARAMS = { sort: "newest", limit: 8 };

function CategoryGrid() {
  const { categories, loading, error, refetch } = usePublicCategories();

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {loading
        ? Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))
        : categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 text-center transition-colors hover:bg-muted"
            >
              {category.imageUrl ? (
                <img
                  src={category.imageUrl}
                  alt=""
                  className="size-14 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                  <PawPrint className="size-6 text-muted-foreground" />
                </div>
              )}
              <span className="text-sm font-medium">{category.name}</span>
            </Link>
          ))}
    </div>
  );
}

export default function Home() {
  const { products, loading, error, refetch } = usePublicProducts(NEWEST_PARAMS);

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-muted px-6 py-12 sm:px-10 sm:py-16">
        <h1 className="max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
          Mọi thứ thú cưng cần, giao tận nhà
        </h1>
        <p className="mt-3 max-w-lg text-muted-foreground">
          Thức ăn, đồ chơi và phụ kiện chính hãng cho chó mèo. Thanh toán khi nhận hàng,
          miễn phí giao hàng cho đơn từ 500.000 ₫.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/products">
            Mua sắm ngay
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Danh mục</h2>
        <CategoryGrid />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Sản phẩm mới</h2>
          <Link to="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Xem tất cả
          </Link>
        </div>
        <ProductGrid products={products} loading={loading} error={error} onRetry={refetch} />
      </section>
    </div>
  );
}
