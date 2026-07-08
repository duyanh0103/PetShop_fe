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
    roles: ["SUPER_ADMIN", "ADMIN", "STAFF"],
    group: "MANAGEMENT",
  },
  {
    title: "Categories",
    path: "/categories",
    icon: FolderTree,
    roles: ["SUPER_ADMIN", "ADMIN"],
    group: "MANAGEMENT",
  },

  {
    title: "Orders",
    path: "/orders",
    icon: ShoppingCart,
    roles: ["SUPER_ADMIN", "ADMIN", "STAFF"],
    group: "SALES",
  },
  {
    title: "Customers",
    path: "/customers",
    icon: Users,
    roles: ["SUPER_ADMIN", "ADMIN"],
    group: "SALES",
  },

  {
    title: "Reviews",
    path: "/reviews",
    icon: Star,
    roles: ["SUPER_ADMIN", "ADMIN"],
    group: "MARKETING",
  },
  {
    title: "Coupons",
    path: "/coupons",
    icon: TicketPercent,
    roles: ["SUPER_ADMIN", "ADMIN"],
    group: "MARKETING",
  },

  {
    title: "Reports",
    path: "/reports",
    icon: ChartColumn,
    roles: ["SUPER_ADMIN", "ADMIN"],
    group: "ANALYTICS",
  },

  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["SUPER_ADMIN", "ADMIN"],
    group: "SYSTEM",
  },
];