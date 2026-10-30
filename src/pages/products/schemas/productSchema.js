import { z } from "zod";

// Mirrors backend's createProductSchema (petshop-be/src/modules/product/product.validation.js).
// SKU format (uppercase/hyphen, 3-30 chars) is a stricter client-side UX
// convention on top of the backend's more permissive "1-100 chars" rule —
// the backend doesn't forbid it, so this is safe to keep.
const productSchema = z.object({
  productName: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm"),
  sku: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập SKU.")
    .min(3, "SKU phải có từ 3 đến 30 ký tự.")
    .max(30, "SKU phải có từ 3 đến 30 ký tự.")
    .regex(/^[A-Z0-9-]+$/, "Chỉ được dùng chữ hoa (A-Z), số (0-9) và dấu gạch ngang (-)."),
  categoryId: z.string().uuid("Vui lòng chọn danh mục"),
  price: z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }

      if (typeof value === "string") {
        const normalized = value.replace(/,/g, "");
        const parsed = Number(normalized);
        return Number.isNaN(parsed) ? undefined : parsed;
      }

      return value;
    },
    z
      .number({ error: "Vui lòng nhập giá hợp lệ" })
      .min(0, "Giá phải lớn hơn hoặc bằng 0")
  ),
  quantity: z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }

      if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
      }

      return value;
    },
    z
      .number({ error: "Vui lòng nhập tồn kho hợp lệ" })
      .int("Tồn kho phải là số nguyên")
      .min(0, "Tồn kho phải lớn hơn hoặc bằng 0")
  ),
  description: z.string().trim().optional().or(z.literal("")),
  imageUrl: z.string().trim().max(1000).optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export default productSchema;
