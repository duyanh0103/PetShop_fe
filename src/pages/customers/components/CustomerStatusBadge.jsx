export default function CustomerStatusBadge({ isActive }) {
  return (
    <span
      className={
        isActive
          ? "rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-950 dark:text-green-300"
          : "rounded-md bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-950 dark:text-red-300"
      }
    >
      {isActive ? "Hoạt động" : "Đã khoá"}
    </span>
  );
}
