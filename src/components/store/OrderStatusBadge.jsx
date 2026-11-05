import { cn } from "@/lib/utils";

const STATUS = {
  PENDING: {
    label: "Chờ xác nhận",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  },
  SHIPPING: {
    label: "Đang giao",
    className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
  },
  COMPLETED: {
    label: "Hoàn thành",
    className: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  },
  CANCELLED: {
    label: "Đã huỷ",
    className: "bg-muted text-muted-foreground",
  },
};

export default function OrderStatusBadge({ status }) {
  const { label, className } = STATUS[status] ?? STATUS.PENDING;

  return (
    <span className={cn("rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap", className)}>
      {label}
    </span>
  );
}
