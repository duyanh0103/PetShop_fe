import StatusBadge from "@/components/common/StatusBadge";

export default function CustomerStatusBadge({ isActive }) {
  return (
    <StatusBadge tone={isActive ? "completed" : "locked"}>
      {isActive ? "Hoạt động" : "Đã khoá"}
    </StatusBadge>
  );
}
