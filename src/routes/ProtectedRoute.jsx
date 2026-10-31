import { Navigate, useLocation } from "react-router-dom";

import useAuthStore from "@/store/authStore";

/**
 * Guards a route (or route subtree) behind authentication, and optionally
 * behind a role whitelist.
 *
 *   <ProtectedRoute allowedRoles={ADMIN_ROLES} fallbackPath="/"><AdminRoutes /></ProtectedRoute>
 *   <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}><Categories /></ProtectedRoute>
 *
 * `loginPath` is where anonymous users go; `fallbackPath` is where a logged-in
 * user without the right role goes.
 */
export default function ProtectedRoute({
  children,
  allowedRoles,
  loginPath = "/admin/login",
  fallbackPath = "/admin/dashboard",
}) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}
