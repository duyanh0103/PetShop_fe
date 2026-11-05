import { z } from "zod";

// Mirrors backend's createOrderSchema (src/modules/order/order.validation.js).
const checkoutSchema = z.object({
  shippingName: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập họ tên người nhận")
    .max(100, "Họ tên không được vượt quá 100 ký tự"),
  shippingPhone: z
    .string()
    .trim()
    .regex(/^0\d{9}$/, "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0"),
  shippingAddress: z
    .string()
    .trim()
    .min(5, "Địa chỉ phải có ít nhất 5 ký tự")
    .max(500, "Địa chỉ không được vượt quá 500 ký tự"),
  note: z.string().trim().max(500, "Ghi chú không được vượt quá 500 ký tự"),
});

export default checkoutSchema;
