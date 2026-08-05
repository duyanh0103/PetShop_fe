import { z } from "zod";

// Mirrors backend's createCategorySchema (petshop-be/src/modules/category/category.validation.js)
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
  slug: z
    .string()
    .trim()
    .max(255)
    .regex(slugRegex, "Slug must be lowercase words separated by hyphens (e.g. dog-food)")
    .optional()
    .or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  imageUrl: z.string().trim().max(1000).optional().or(z.literal("")),
  sortOrder: z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) return 0;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }, z.number({ error: "Sort order must be a number" }).int("Sort order must be a whole number")),
  isActive: z.boolean().default(true),
});

export default categorySchema;
