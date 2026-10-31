import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

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

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>PetShop · Mọi thứ thú cưng cần, giao tận nhà</p>
          <div className="flex gap-4">
            <Link to="/products" className="hover:text-foreground">
              Sản phẩm
            </Link>
            <span>© 2026 PetShop</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
