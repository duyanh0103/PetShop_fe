import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Star,
  TicketPercent,
  ChartColumn,
  Settings,
} from "lucide-react";

export const sidebarMenu = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "ADMIN", "STAFF"],
    group: "MAIN",
  },
  {
    title: "Products",
    path: "/products",
    icon: Package,
  },
  {
    title: "Categories",
    path: "/categories",
    icon: FolderTree,
  },
  {
    title: "Orders",
    path: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    path: "/customers",
    icon: Users,
  },
  {
    title: "Reviews",
    path: "/reviews",
    icon: Star,
  },
  {
    title: "Coupons",
    path: "/coupons",
    icon: TicketPercent,
  },
  {
    title: "Reports",
    path: "/reports",
    icon: ChartColumn,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];
