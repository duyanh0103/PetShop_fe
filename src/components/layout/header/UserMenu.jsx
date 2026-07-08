import { ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserMenu() {
  // TODO: Lấy từ store sau khi tích hợp Authentication
  const user = {
    username: "superadmin@petshop.com",
    role: "SUPER_ADMIN",
  };

  return (
    <Button
      variant="ghost"
      className="flex h-auto items-center gap-3 px-2 py-1"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
        <User className="h-5 w-5" />
      </div>

      <div className="hidden text-left md:block">
        <p className="text-sm font-medium">{user.username}</p>
        <p className="text-xs text-muted-foreground">{user.role}</p>
      </div>

      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    </Button>
  );
}