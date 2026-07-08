import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "@/layouts/AdminLayout";

import Dashboard from "@/pages/dashboard/Dashboard";
import Products from "@/pages/products/Products";
import Categories from "@/pages/categories/Categories";
import Orders from "@/pages/orders/Orders";
import Customers from "@/pages/customers/Customers";
import Reviews from "@/pages/reviews/Reviews";
import Coupons from "@/pages/coupons/Coupons";
import Reports from "@/pages/reports/Reports";
import Settings from "@/pages/settings/Settings";

import NotFound from "./NotFound";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}