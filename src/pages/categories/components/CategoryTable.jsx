import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Edit3, Trash2 } from "lucide-react";
import { imageUrl } from "@/lib/image";

function getStatusBadge(isActive) {
  return isActive
    ? "bg-emerald-100 text-emerald-700"
    : "bg-slate-100 text-slate-700";
}

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
  onToggleStatus,
  togglingId,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[320px]">Danh mục</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Sản phẩm</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-sm text-slate-500">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {category.imageUrl ? (
                      <img
                        src={imageUrl(category.imageUrl, 120)}
                        alt={category.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                        Không có ảnh
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-900">{category.name}</p>
                      <p className="text-sm text-slate-500">/{category.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-[320px] truncate text-sm text-slate-600">
                  {category.description || "—"}
                </TableCell>
                <TableCell>{category.productCount ?? 0}</TableCell>
                <TableCell>
                  <button
                    type="button"
                    disabled={togglingId === category.id}
                    onClick={() => onToggleStatus?.(category)}
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold transition disabled:opacity-50 ${getStatusBadge(category.isActive)}`}
                    title="Nhấn để chuyển trạng thái"
                  >
                    {category.isActive ? "Hoạt động" : "Ngừng hoạt động"}
                  </button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                      onClick={() => onEdit?.(category)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                      onClick={() => onDelete?.(category)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
