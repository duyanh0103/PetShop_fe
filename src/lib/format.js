const priceFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

// 450000 -> "450.000 ₫"
export const formatPrice = (value) => priceFormatter.format(Number(value) || 0);
