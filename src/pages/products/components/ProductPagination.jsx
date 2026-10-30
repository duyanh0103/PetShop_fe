import Pagination from "@/components/common/Pagination";

// Thin wrapper kept for backward compatibility with existing imports;
// the actual UI now lives in the shared Pagination component so every
// admin list page (Products, Categories, ...) stays visually consistent.
export default function ProductPagination(props) {
  return <Pagination {...props} itemLabel="sản phẩm" />;
}
