import { ChevronDown, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuthStore from "@/store/authStore";

export default function UserMenu() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-auto items-center gap-3 px-2 py-1"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <User className="h-5 w-5" />
          </div>

          <div className="hidden text-left md:block">
            <p className="text-sm font-medium">{user?.username ?? "Khách"}</p>
            <p className="text-xs text-muted-foreground">{user?.role ?? ""}</p>
          </div>

          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem disabled className="opacity-100">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {user?.username}
            </span>
            <span className="text-xs text-muted-foreground">{user?.role}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
