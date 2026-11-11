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

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

// isActive is the only field the backend persists; "Out of stock" is a
// purely visual, computed state from quantity — it doesn't gate anything
// server-side and isn't filterable.
function getStatusInfo(product) {
  if (!product.isActive) {
    return { label: "Ngừng hoạt động", className: "bg-slate-100 text-slate-700" };
  }

  if (product.quantity === 0) {
    return { label: "Hết hàng", className: "bg-amber-100 text-amber-700" };
  }

  return { label: "Hoạt động", className: "bg-emerald-100 text-emerald-700" };
}

export default function ProductTable({
  products,
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
            <TableHead className="w-[320px]">Sản phẩm</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead>Tồn kho</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-sm text-slate-500">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              const status = getStatusInfo(product);

              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        <img
                          src={imageUrl(product.imageUrl, 120)}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                          Không có ảnh
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">{product.name}</p>
                        <p className="text-sm text-slate-500">SKU: {product.sku}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category?.name ?? "—"}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <button
                      type="button"
                      disabled={togglingId === product.id}
                      onClick={() => onToggleStatus?.(product)}
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold transition disabled:opacity-50 ${status.className}`}
                      title="Nhấn để chuyển trạng thái"
                    >
                      {status.label}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        onClick={() => onEdit?.(product)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        onClick={() => onDelete?.(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
