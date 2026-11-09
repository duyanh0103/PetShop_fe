import StatusBadge from "@/components/common/StatusBadge";
import { ORDER_STATUS_LABELS } from "@/lib/orderStatus";

export default function OrderStatusBadge({ status, className }) {
  const known = status in ORDER_STATUS_LABELS ? status : "PENDING";

  return (
    <StatusBadge tone={known.toLowerCase()} className={className}>
      {ORDER_STATUS_LABELS[known]}
    </StatusBadge>
  );
}
