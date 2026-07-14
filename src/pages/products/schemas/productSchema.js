import { z } from "zod";

const productSchema = z.object({
  productName: z.string().trim().min(1, "Product Name is required"),
  sku: z
    .string()
    .trim()
    .min(1, "SKU is required.")
    .min(3, "SKU must be between 3 and 30 characters.")
    .max(30, "SKU must be between 3 and 30 characters.")
    .regex(/^[A-Z0-9-]+$/, "Only uppercase letters (A-Z), numbers (0-9) and hyphen (-) are allowed."),
  category: z.string().trim().min(1, "Category is required"),
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
      .number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a number",
      })
      .min(0, "Price must be greater than or equal to 0")
  ),
  stock: z.preprocess(
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
      .number({
        required_error: "Stock is required",
        invalid_type_error: "Stock must be a number",
      })
      .int("Stock must be a whole number")
      .min(0, "Stock must be greater than or equal to 0")
  ),
  description: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"], {
    required_error: "Status is required",
  }),
  imageFile: z.any().nullable().optional(),
});

export default productSchema;
