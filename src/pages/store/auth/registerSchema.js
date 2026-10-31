import { z } from "zod";

// Mirrors backend's registerSchema (src/modules/auth/auth.validation.js),
// plus the client-only "confirm password" check.
const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập họ tên")
      .max(100, "Họ tên không được vượt quá 100 ký tự"),
    email: z.string().trim().pipe(z.email("Email không hợp lệ")),
    username: z
      .string()
      .trim()
      .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
      .max(50, "Tên đăng nhập không được vượt quá 50 ký tự")
      .regex(/^[a-zA-Z0-9_]+$/, "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"),
    phone: z
      .string()
      .trim()
      .refine((value) => value === "" || /^0\d{9}$/.test(value), {
        message: "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0",
      }),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .max(100, "Mật khẩu không được vượt quá 100 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu nhập lại không khớp",
  });

export default registerSchema;
