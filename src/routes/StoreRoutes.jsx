import { Routes, Route } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import StoreLayout from "@/layouts/StoreLayout";

import Home from "@/pages/store/Home";
import ProductList from "@/pages/store/ProductList";
import ProductDetail from "@/pages/store/ProductDetail";
import CustomerLogin from "@/pages/store/auth/CustomerLogin";
import Register from "@/pages/store/auth/Register";
import StoreNotFound from "@/pages/store/StoreNotFound";
import Cart from "@/pages/store/Cart";
import Checkout from "@/pages/store/Checkout";
import Orders from "@/pages/store/Orders";
import OrderDetail from "@/pages/store/OrderDetail";
import { CUSTOMER_ROLES } from "@/lib/roles";

import ProtectedRoute from "./ProtectedRoute";

// Admin accounts cannot buy; /cart explains why instead of a silent redirect.
const customerOnly = (element) => (
  <ProtectedRoute allowedRoles={CUSTOMER_ROLES} loginPath="/login" fallbackPath="/cart">
    {element}
  </ProtectedRoute>
);

// Public storefront, mounted at "/*" by AppRouter.
export default function StoreRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<CustomerLogin />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route element={<StoreLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={customerOnly(<Checkout />)} />
        <Route path="orders" element={customerOnly(<Orders />)} />
        <Route path="orders/:id" element={customerOnly(<OrderDetail />)} />
        <Route path="*" element={<StoreNotFound />} />
      </Route>
    </Routes>
  );
}
