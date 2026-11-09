import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@/lib/zodResolver";
import loginSchema from "@/pages/auth/schemas/loginSchema";
import authService from "@/services/authService";
import useAuthStore from "@/store/authStore";

import { AuthCard, FormField, ServerError } from "./AuthCard";

export default function CustomerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
    mode: "onTouched",
  });

  const redirectTo = location.state?.from?.pathname ?? "/";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (values) => {
    setServerError("");

    try {
      const { user, token } = await authService.login(values);
      setAuth({ user, token });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setServerError(error.response?.data?.message ?? "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <AuthCard
      title="Đăng nhập"
      description="Đăng nhập để đặt hàng và xem đơn của bạn."
      footer={
        <>
          Chưa có tài khoản?{" "}
          <Link to="/register" state={location.state} className="font-extrabold text-primary hover:underline">
            Đăng ký
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <FormField
          id="identifier"
          label="Email hoặc tên đăng nhập"
          autoComplete="username"
          error={errors.identifier}
          registration={register("identifier")}
        />
        <FormField
          id="password"
          label="Mật khẩu"
          type="password"
          autoComplete="current-password"
          error={errors.password}
          registration={register("password")}
        />
        <ServerError message={serverError} />
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>
    </AuthCard>
  );
}
