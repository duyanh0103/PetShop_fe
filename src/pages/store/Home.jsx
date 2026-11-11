import { Banknote, Phone, Truck } from "lucide-react";
import { Link } from "react-router-dom";

import { BRAND_TAGLINE, HOTLINE, HOTLINE_TEL } from "@/components/brand/BrandLogo";
import PawIcon from "@/components/brand/PawIcon";
import ProductGrid, { ErrorState } from "@/components/store/ProductGrid";
import { Button } from "@/components/ui/button";
import logoLarge from "@/assets/brand/logo-512.webp";

import { usePublicCategories, usePublicProducts } from "./hooks/useStoreCatalog";
import { imageUrl } from "@/lib/image";

const NEWEST_PARAMS = { sort: "newest", limit: 8 };

// Category tiles cycle through the design's soft tints.
const TILE_COLORS = ["#fff1c2", "#d6eafd", "#fce3ea", "#e4f1fe", "#ddf3e6", "#ece6ff"];

const PROMISES = [
  { icon: Banknote, title: "Thanh toán khi nhận hàng", text: "Chỉ COD, không cần thẻ" },
  { icon: Truck, title: "Miễn phí vận chuyển", text: "Cho đơn từ 500.000 ₫" },
  { icon: Phone, title: "Hotline / Zalo", text: HOTLINE },
];

function CategoryGrid() {
  const { categories, loading, error, refetch } = usePublicCategories();

  if (error) {
    return <ErrorState title="Không tải được danh mục" message={error.message} onRetry={refetch} />;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3.5">
      {loading
        ? Array.from({ length: 6 }, (_, index) => <div key={index} className="skeleton h-[138px] rounded-[20px]" />)
        : categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className="flex flex-col items-center gap-2.5 rounded-[20px] border-[1.5px] border-border bg-card p-4 text-center font-bold text-foreground transition-colors hover:border-[#8cc2fa]"
            >
              {category.imageUrl ? (
                <img src={imageUrl(category.imageUrl, 160)} alt="" className="size-[72px] rounded-full object-cover" />
              ) : (
                <span
                  className="flex size-[72px] items-center justify-center rounded-full text-primary"
                  style={{ backgroundColor: TILE_COLORS[index % TILE_COLORS.length] }}
                >
                  <PawIcon size={32} />
                </span>
              )}
              {category.name}
            </Link>
          ))}
    </div>
  );
}

export default function Home() {
  const { products, loading, error, refetch } = usePublicProducts(NEWEST_PARAMS);

  return (
    <>
      <section className="bg-pastel">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-8 px-4 pt-10 pb-14 sm:px-5 sm:pt-12">
          <div className="flex flex-[1_1_420px] flex-col items-start gap-[18px]">
            <span className="rounded-full bg-card px-3.5 py-1.5 text-sm font-extrabold text-brand">
              {BRAND_TAGLINE}
            </span>
            <h1 className="text-[clamp(36px,5vw,60px)] leading-[1.05] text-foreground">
              Mọi thứ thú cưng cần, giao tận nhà
            </h1>
            <p className="max-w-[520px] text-lg leading-relaxed text-body">
              Một chiếc shop nhỏ dành cho những chiếc bụng mê{" "}
              <span className="rounded-md bg-highlight px-1.5 font-extrabold text-highlight-foreground">pate</span>{" "}
              cùng gu với Cục Meow ạ.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-13 px-7 text-[17px]">
                <Link to="/products">Mua sắm ngay</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={HOTLINE_TEL}>Gọi {HOTLINE}</a>
              </Button>
            </div>
          </div>
          <img
            src={logoLarge}
            alt="Ba bé mèo của Cục Meow"
            width={380}
            height={380}
            className="mx-auto h-auto w-full max-w-[240px] flex-[0_1_380px] sm:max-w-[380px]"
          />
        </div>
      </section>

      <div className="relative mx-auto -mt-6 max-w-[1200px] px-4 sm:px-5">
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3 rounded-[20px] border-[1.5px] border-border bg-card px-5 py-4">
          {PROMISES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span>
                <b>{title}</b>
                <br />
                <span className="text-sm text-muted-foreground">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto max-w-[1200px] space-y-12 px-4 pt-12 sm:px-5">
        <section className="space-y-[18px]">
          <h2 className="text-[30px]">Danh mục</h2>
          <CategoryGrid />
        </section>

        <section className="space-y-[18px]">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-[30px]">Hàng mới về</h2>
            <Link to="/products" className="font-extrabold text-primary hover:text-brand">
              Xem tất cả →
            </Link>
          </div>
          <ProductGrid products={products} loading={loading} error={error} onRetry={refetch} />
        </section>
      </div>
    </>
  );
}
