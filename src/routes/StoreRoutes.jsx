import { Routes, Route } from "react-router-dom";

import StoreLayout from "@/layouts/StoreLayout";

import Home from "@/pages/store/Home";
import ProductList from "@/pages/store/ProductList";
import ProductDetail from "@/pages/store/ProductDetail";
import CustomerLogin from "@/pages/store/auth/CustomerLogin";
import Register from "@/pages/store/auth/Register";
import StoreNotFound from "@/pages/store/StoreNotFound";

// Public storefront, mounted at "/*" by AppRouter.
export default function StoreRoutes() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="login" element={<CustomerLogin />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<StoreNotFound />} />
      </Route>
    </Routes>
  );
}
