import { z } from "zod";

// Mirrors backend's createCategorySchema (petshop-be/src/modules/category/category.validation.js)
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const categorySchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên danh mục").max(255),
  slug: z
    .string()
    .trim()
    .max(255)
    .regex(slugRegex, "Slug chỉ được chứa chữ thường, số, cách nhau bởi dấu gạch ngang (vd: thuc-an-cho-cho)")
    .optional()
    .or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  imageUrl: z.string().trim().max(1000).optional().or(z.literal("")),
  sortOrder: z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) return 0;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }, z.number({ error: "Thứ tự sắp xếp phải là số" }).int("Thứ tự sắp xếp phải là số nguyên")),
  isActive: z.boolean().default(true),
});

export default categorySchema;
