import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@/lib/zodResolver";
import authService from "@/services/authService";
import useAuthStore from "@/store/authStore";

import loginSchema from "./schemas/loginSchema";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values) => {
    setServerError("");

    try {
      const { user, token } = await authService.login(values);
      setAuth({ user, token });

      const redirectTo = location.state?.from?.pathname ?? "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setServerError(
        error.response?.data?.message ?? "Đăng nhập thất bại. Vui lòng thử lại."
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-lg font-semibold text-white">
            P
          </div>
          <h1 className="text-xl font-semibold text-slate-900">
            PetShop Admin
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Đăng nhập để quản lý cửa hàng của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-slate-900">
              Tên đăng nhập
            </label>
            <Input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="Nhập tên đăng nhập"
              aria-invalid={Boolean(errors.username)}
              {...register("username")}
            />
            {errors.username ? (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-900">
              Mật khẩu
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Nhập mật khẩu"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            ) : null}
          </div>

          {serverError ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {serverError}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </div>
    </div>
  );
}
