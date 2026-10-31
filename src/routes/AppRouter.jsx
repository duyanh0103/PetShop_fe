import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "@/pages/auth/Login";
import { ADMIN_ROLES } from "@/lib/roles";

import AdminRoutes from "./AdminRoutes";
import StoreRoutes from "./StoreRoutes";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      {/* Old admin login URL, kept so existing bookmarks still work. */}
      <Route path="/auth/*" element={<Navigate to="/admin/login" replace />} />
      <Route
        path="/admin/*"
        element={
          // Customers who reach /admin are sent back to the storefront.
          <ProtectedRoute allowedRoles={ADMIN_ROLES} fallbackPath="/">
            <AdminRoutes />
          </ProtectedRoute>
        }
      />
      <Route path="/*" element={<StoreRoutes />} />
    </Routes>
  );
}
