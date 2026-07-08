import { Badge } from "@/components/ui/badge";

const statusMap = {
  ACTIVE: {
    label: "Active",
    className: "bg-green-100 text-green-700",
  },
  INACTIVE: {
    label: "Inactive",
    className: "bg-gray-100 text-gray-700",
  },
  OUT_OF_STOCK: {
    label: "Out of Stock",
    className: "bg-red-100 text-red-700",
  },
};

export default function ProductStatusBadge({ status }) {
  const item = statusMap[status];

  return (
    <Badge className={item.className}>
      {item.label}
    </Badge>
  );
}