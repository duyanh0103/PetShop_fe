import { Routes, Route, Navigate } from "react-router-dom";

import Login from "@/pages/auth/Login";

// Self-contained nested router mounted at "/auth/*" by AppRouter.
export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
}
