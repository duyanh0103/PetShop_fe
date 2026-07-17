import { Bell, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { sidebarMenu } from "@/data/menu";

import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

export default function Header({ onToggleSidebar, isSidebarCollapsed }) {
  const { pathname } = useLocation();

  const currentMenu = sidebarMenu.find((item) => item.path === pathname);

  const pageTitle = currentMenu?.title || "PetShop";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <h1 className="text-xl font-semibold">{pageTitle}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <UserMenu />
      </div>
    </header>
  );
}