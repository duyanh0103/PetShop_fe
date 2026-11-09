import { useState } from "react";
import { LayoutDashboard, LogOut, ReceiptText, Search, ShoppingCart, User } from "lucide-react";
import { Link, NavLink, useMatch, useNavigate, useSearchParams } from "react-router-dom";

import BrandLogo from "@/components/brand/BrandLogo";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { isAdminRole } from "@/lib/roles";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import useCartStore, { selectCartCount } from "@/store/cartStore";

const navLinkClassName = ({ isActive }) =>
  cn(
    "rounded-full px-3 py-2.5 font-bold text-foreground transition-colors hover:bg-pastel",
    isActive && "bg-pastel"
  );

function SearchForm({ className }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSearch = searchParams.get("search") ?? "";
  const [value, setValue] = useState(currentSearch);

  // Keep the box in sync when the URL search changes elsewhere
  // (e.g. "clear filters" on the product list).
  const [prevSearch, setPrevSearch] = useState(currentSearch);
  if (currentSearch !== prevSearch) {
    setPrevSearch(currentSearch);
    setValue(currentSearch);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const search = value.trim();
    navigate(search ? `/products?search=${encodeURIComponent(search)}` : "/products");
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)} role="search">
      <Search className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Tìm pate, hạt, cát…"
        aria-label="Tìm sản phẩm"
        className="rounded-full pl-11"
      />
    </form>
  );
}

function CartLink() {
  const count = useCartStore(selectCartCount);
  const onCartPage = Boolean(useMatch("/cart"));

  return (
    <Link
      to="/cart"
      aria-label={`Giỏ hàng, ${count} sản phẩm`}
      aria-current={onCartPage ? "page" : undefined}
      className={cn(
        "relative inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors",
        onCartPage ? "bg-primary text-primary-foreground" : "bg-pastel text-foreground hover:bg-[#c4defa]"
      )}
    >
      <ShoppingCart className="size-[22px]" />
      {count > 0 ? (
        <span className="absolute -top-1 -right-1.5 flex min-w-5 items-center justify-center rounded-full border-2 border-card bg-highlight px-1.5 text-[11px] leading-4 font-extrabold text-highlight-foreground">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}

function AccountMenu() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  if (!isAuthenticated) {
    return (
      <Button asChild>
        <Link to="/login">Đăng nhập</Link>
      </Button>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="gap-2 px-3.5" aria-label="Tài khoản">
          <User className="size-[18px]" />
          <span className="hidden max-w-32 truncate sm:inline">
            {user?.fullName || user?.username}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem disabled className="opacity-100">
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-extrabold text-foreground">
              {user?.fullName || user?.username}
            </span>
            {user?.email ? (
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            ) : null}
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isAdminRole(user?.role) ? (
          <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
            <LayoutDashboard className="mr-2 size-4" />
            Trang quản trị
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => navigate("/orders")}>
            <ReceiptText className="mr-2 size-4" />
            Đơn hàng của tôi
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          <LogOut className="mr-2 size-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function StoreHeader() {
  return (
    <header className="sticky top-0 z-30 border-b-[1.5px] border-border bg-card">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-3 gap-y-3 px-4 py-3 sm:gap-x-5 sm:px-5">
        <BrandLogo size={44} textClassName="text-[22px] sm:text-[26px]" />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Điều hướng chính">
          <NavLink to="/" end className={navLinkClassName}>
            Trang chủ
          </NavLink>
          <NavLink to="/products" className={navLinkClassName}>
            Sản phẩm
          </NavLink>
        </nav>

        <SearchForm className="hidden min-w-0 flex-[1_1_260px] sm:block" />

        <div className="ml-auto flex items-center gap-2.5">
          <CartLink />
          <AccountMenu />
        </div>

        <SearchForm className="w-full sm:hidden" />
      </div>
    </header>
  );
}
