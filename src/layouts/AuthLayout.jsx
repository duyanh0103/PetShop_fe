import { Link, Outlet } from "react-router-dom";

import BrandLogo from "@/components/brand/BrandLogo";

// Customer login/register: pastel page with a slim header, as in the design.
export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-pastel text-foreground">
      <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-3 px-4 py-4 sm:px-5">
        <BrandLogo size={44} textClassName="text-[22px] sm:text-[26px]" />
        <Link to="/products" className="font-bold text-primary hover:underline">
          Tiếp tục mua sắm
        </Link>
      </header>
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 pt-4 pb-14 sm:px-5">
        <Outlet />
      </main>
    </div>
  );
}
