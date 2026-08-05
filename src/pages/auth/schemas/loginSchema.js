import { z } from "zod";

// Mirrors backend's loginSchema (src/modules/auth/auth.validation.js) exactly:
// login only requires non-empty fields. The stricter "3-50 alnum/underscore"
// rule belongs to register, not login — the seeded SUPER_ADMIN username
// ("superadmin@petshop.com") wouldn't satisfy that regex, so it must not be
// enforced here.
const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default loginSchema;
