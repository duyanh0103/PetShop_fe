import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { BRAND_NAME, BRAND_TAGLINE, HOTLINE, HOTLINE_TEL } from "@/components/brand/BrandLogo";
import StoreHeader from "@/components/store/StoreHeader";

export default function StoreLayout() {
  const { pathname, search } = useLocation();

  // Each storefront navigation (including page changes) starts at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <StoreHeader />

      {/* The home page draws its own full-width hero, so it skips the container. */}
      <main
        className={
          pathname === "/"
            ? "w-full flex-1 pb-14"
            : "mx-auto w-full max-w-[1200px] flex-1 px-4 pt-6 pb-14 sm:px-5 sm:pt-8"
        }
      >
        <Outlet />
      </main>

      <footer className="bg-[#13306e] text-[#e6f0fd]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-10 gap-y-4 px-4 py-7 sm:px-5">
          <span className="font-heading text-2xl font-extrabold text-white">{BRAND_NAME}</span>
          <span className="basis-full sm:flex-1 sm:basis-auto">{BRAND_TAGLINE}</span>
          <Link to="/products" className="text-[#b9dafb] hover:text-white">
            Sản phẩm
          </Link>
          <a href={HOTLINE_TEL} className="text-[#b9dafb] hover:text-white">
            Hotline / Zalo {HOTLINE}
          </a>
          <span className="text-[13px] text-[#b9dafb]">© 2026 {BRAND_NAME}</span>
        </div>
      </footer>
    </div>
  );
}
