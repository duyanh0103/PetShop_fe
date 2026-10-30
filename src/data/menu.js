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
    title: "Tổng quan",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "ADMIN", "STAFF"],
    group: "CHÍNH",
  },

  {
    title: "Sản phẩm",
    path: "/products",
    icon: Package,
    roles: ["SUPER_ADMIN", "ADMIN", "STAFF"],
    group: "QUẢN LÝ",
  },
  {
    title: "Danh mục",
    path: "/categories",
    icon: FolderTree,
    roles: ["SUPER_ADMIN", "ADMIN"],
    group: "QUẢN LÝ",
  },

  {
    title: "Đơn hàng",
    path: "/orders",
    icon: ShoppingCart,
    roles: ["SUPER_ADMIN", "ADMIN", "STAFF"],
    group: "BÁN HÀNG",
  },
  {
    title: "Khách hàng",
    path: "/customers",
    icon: Users,
    roles: ["SUPER_ADMIN", "ADMIN"],
    group: "BÁN HÀNG",
  },

  {
    title: "Đánh giá",
    path: "/reviews",
    icon: Star,
    roles: ["SUPER_ADMIN", "ADMIN"],
    group: "TIẾP THỊ",
  },
  {
    title: "Mã giảm giá",
    path: "/coupons",
    icon: TicketPercent,
    roles: ["SUPER_ADMIN", "ADMIN"],
    group: "TIẾP THỊ",
  },

  {
    title: "Báo cáo",
    path: "/reports",
    icon: ChartColumn,
    roles: ["SUPER_ADMIN", "ADMIN"],
    group: "PHÂN TÍCH",
  },

  {
    title: "Cài đặt",
    path: "/settings",
    icon: Settings,
    roles: ["SUPER_ADMIN", "ADMIN"],
    group: "HỆ THỐNG",
  },
];