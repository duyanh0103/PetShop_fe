const priceFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

// 450000 -> "450.000 ₫"
export const formatPrice = (value) => priceFormatter.format(Number(value) || 0);

const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});

// "2026-11-04T08:30:00Z" -> "15:30 4/11/26"
export const formatDateTime = (value) => dateTimeFormatter.format(new Date(value));
