import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@/lib/zodResolver";
import authService from "@/services/authService";
import useAuthStore from "@/store/authStore";

import { AuthCard, FormField, ServerError } from "./AuthCard";
import registerSchema from "./registerSchema";

// Paired fields sit side by side from tablet width, as in the design.
const FIELDS = [
  { name: "fullName", label: "Họ tên", autoComplete: "name", full: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "username", label: "Tên đăng nhập", autoComplete: "username" },
  { name: "phone", label: "Số điện thoại", hint: "(không bắt buộc)", type: "tel", autoComplete: "tel", placeholder: "0xxxxxxxxx", full: true },
  { name: "password", label: "Mật khẩu", type: "password", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Nhập lại mật khẩu", type: "password", autoComplete: "new-password" },
];

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: Object.fromEntries(FIELDS.map((field) => [field.name, ""])),
    mode: "onTouched",
  });

  const redirectTo = location.state?.from?.pathname ?? "/";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (values) => {
    setServerError("");

    const { fullName, email, username, phone, password } = values;

    try {
      const { user, token } = await authService.register({
        fullName,
        email,
        username,
        password,
        ...(phone ? { phone } : {}),
      });
      setAuth({ user, token });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const data = error.response?.data;

      // Field-level errors from the backend validator land under their input.
      if (data?.errors) {
        Object.entries(data.errors).forEach(([field, messages]) => {
          setError(field, { message: messages[0] });
        });
      }

      setServerError(data?.message ?? "Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <AuthCard
      title="Đăng ký"
      wide
      description="Trở thành đồng minh cùng gu Pate."
      footer={
        <>
          Đã có tài khoản?{" "}
          <Link to="/login" state={location.state} className="font-extrabold text-primary hover:underline">
            Đăng nhập
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div className="grid gap-3.5 sm:grid-cols-2">
          {FIELDS.map(({ name, full, ...field }) => (
            <FormField
              key={name}
              id={name}
              className={full ? "sm:col-span-2" : undefined}
              {...field}
              error={errors[name]}
              registration={register(name)}
            />
          ))}
        </div>
        <ServerError message={serverError} />
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}
        </Button>
      </form>
    </AuthCard>
  );
}
