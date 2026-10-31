import { useState } from "react";
import { LayoutDashboard, LogOut, PawPrint, Search, User } from "lucide-react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";

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

const navLinkClassName = ({ isActive }) =>
  cn(
    "text-sm font-medium transition-colors hover:text-foreground",
    isActive ? "text-foreground" : "text-muted-foreground"
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
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Tìm sản phẩm..."
        aria-label="Tìm sản phẩm"
        className="pl-8"
      />
    </form>
  );
}

function AccountMenu() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  if (!isAuthenticated) {
    return (
      <Button asChild variant="outline">
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
        <Button variant="ghost" className="gap-2" aria-label="Tài khoản">
          <User className="size-4" />
          <span className="hidden max-w-32 truncate sm:inline">
            {user?.fullName || user?.username}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem disabled className="opacity-100">
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-foreground">
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
        ) : null}
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
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-semibold text-foreground">
          <PawPrint className="size-6" />
          <span>PetShop</span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex" aria-label="Điều hướng chính">
          <NavLink to="/" end className={navLinkClassName}>
            Trang chủ
          </NavLink>
          <NavLink to="/products" className={navLinkClassName}>
            Sản phẩm
          </NavLink>
        </nav>

        <SearchForm className="ml-auto hidden w-full max-w-xs sm:block" />

        <div className="ml-auto sm:ml-0">
          <AccountMenu />
        </div>
      </div>

      <div className="px-4 pb-3 sm:hidden">
        <SearchForm />
      </div>
    </header>
  );
}
