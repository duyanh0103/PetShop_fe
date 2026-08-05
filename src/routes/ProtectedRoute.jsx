import { Navigate, useLocation } from "react-router-dom";

import useAuthStore from "@/store/authStore";

/**
 * Guards a route (or route subtree) behind authentication, and optionally
 * behind a role whitelist.
 *
 *   <ProtectedRoute><AdminRoutes /></ProtectedRoute>
 *   <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}><Categories /></ProtectedRoute>
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
