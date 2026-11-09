// [status, label] in workflow order, for filters and summaries.
export const ORDER_STATUS_OPTIONS = [
  ["PENDING", "Chờ xác nhận"],
  ["CONFIRMED", "Đã xác nhận"],
  ["SHIPPING", "Đang giao"],
  ["COMPLETED", "Hoàn thành"],
  ["CANCELLED", "Đã huỷ"],
];

export const ORDER_STATUS_LABELS = Object.fromEntries(ORDER_STATUS_OPTIONS);
