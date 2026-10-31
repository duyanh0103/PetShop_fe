import { z } from "zod";

// Mirrors backend's loginSchema (src/modules/auth/auth.validation.js) exactly:
// login only requires non-empty fields. The stricter "3-50 alnum/underscore"
// rule belongs to register, not login — the seeded SUPER_ADMIN username
// ("superadmin@petshop.com") wouldn't satisfy that regex, so it must not be
// enforced here. Shared by the admin and the storefront login forms.
const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Vui lòng nhập email hoặc tên đăng nhập"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export default loginSchema;
