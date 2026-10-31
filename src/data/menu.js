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
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "ADMIN", "STAFF"],
    group: "CHÍNH",
  },

  {
    title: "Sản phẩm",
    path: "/admin/products",
    icon: Package,
    roles: ["SUPER_ADMIN", "ADMIN", "STAFF"],
    group: "QUẢN LÝ",
  },
  {
    title: "Danh mục",
    path: "/admin/categories",
    icon: FolderTree,
    roles: ["SUPER_ADMIN", "ADMIN"],
    group: "QUẢN LÝ",
  },

  {
    title: "Đơn hàng",
    path: "/admin/orders",
    icon: ShoppingCart,
    roles: ["SUPER_ADMIN", "ADMIN", "STAFF"],
    group: "BÁN HÀNG",
  },
  {
    title: "Khách hàng",
    path: "/admin/customers",
    icon: Users,
    roles: ["SUPER_ADMIN", "ADMIN"],
    group: "BÁN HÀNG",
  },

  {
    title: "Đánh giá",
    path: "/admin/reviews",
    icon: Star,
    roles: ["SUPER_ADMIN", "ADMIN"],
    group: "TIẾP THỊ",
  },
  {
    title: "Mã giảm giá",
    path: "/admin/coupons",
    icon: TicketPercent,
    roles: ["SUPER_ADMIN", "ADMIN"],
    group: "TIẾP THỊ",
  },

  {
    title: "Báo cáo",
    path: "/admin/reports",
    icon: ChartColumn,
    roles: ["SUPER_ADMIN", "ADMIN"],
    group: "PHÂN TÍCH",
  },

  {
    title: "Cài đặt",
    path: "/admin/settings",
    icon: Settings,
    roles: ["SUPER_ADMIN", "ADMIN"],
    group: "HỆ THỐNG",
  },
];