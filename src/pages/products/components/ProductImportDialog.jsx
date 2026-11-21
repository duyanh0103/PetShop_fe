import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import productExcelService from "../services/productExcelService";
import useProductImport from "../hooks/useProductImport";

const PREVIEW_LIMIT = 10;
const formatPrice = (value) => Number(value).toLocaleString("vi-VN");

function ErrorList({ title, errors }) {
  if (errors.length === 0) return null;
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      <p className="font-medium">{title}</p>
      <ul className="mt-1 max-h-40 list-disc space-y-0.5 overflow-y-auto pl-5">
        {errors.map((error) => (
          <li key={error.row}>Dòng {error.row}: {error.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ProductImportDialog({ open, onOpenChange, categories = [], onImported }) {
  const { preview, busy, progress, result, reset, handleFile, handleImport } = useProductImport({
    categories,
    onImported,
  });
  const { validRows, errors, fileName } = preview;

  const handleOpenChange = (nextOpen) => {
    if (busy) return; // closing mid-import would hide which rows were saved
    if (!nextOpen) reset();
    onOpenChange?.(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader className="pr-8 text-left">
          <DialogTitle>Nhập sản phẩm từ Excel</DialogTitle>
          <DialogDescription>
            Tải file mẫu, điền sản phẩm vào sheet "SanPham" rồi chọn file để xem trước.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => productExcelService.downloadTemplate(categories)}
            >
              Tải file mẫu
            </Button>
            <label className="text-sm">
              <span className="sr-only">Chọn file Excel</span>
              <input
                type="file"
                accept=".xlsx"
                disabled={busy}
                onChange={(event) => {
                  handleFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
                className="text-sm file:mr-3 file:rounded-md file:border file:border-border file:bg-background file:px-3 file:py-1.5"
              />
            </label>
          </div>

          {result ? (
            <>
              <p className="text-sm font-medium text-emerald-700">Đã tạo {result.created} sản phẩm.</p>
              <ErrorList title={`${result.failures.length} dòng không lưu được:`} errors={result.failures} />
            </>
          ) : fileName ? (
            <>
              <p className="text-sm text-muted-foreground">
                {fileName}: {validRows.length} dòng hợp lệ, {errors.length} dòng lỗi.
              </p>
              <ErrorList title="Các dòng lỗi sẽ bị bỏ qua:" errors={errors} />
              {validRows.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-left">
                      <tr>
                        <th className="px-3 py-2">Dòng</th>
                        <th className="px-3 py-2">SKU</th>
                        <th className="px-3 py-2">Tên</th>
                        <th className="px-3 py-2 text-right">Giá</th>
                        <th className="px-3 py-2 text-right">SL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {validRows.slice(0, PREVIEW_LIMIT).map(({ rowNumber, payload }) => (
                        <tr key={rowNumber} className="border-t border-border">
                          <td className="px-3 py-2">{rowNumber}</td>
                          <td className="px-3 py-2">{payload.sku}</td>
                          <td className="px-3 py-2">{payload.name}</td>
                          <td className="px-3 py-2 text-right">{formatPrice(payload.price)}</td>
                          <td className="px-3 py-2 text-right">{payload.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {validRows.length > PREVIEW_LIMIT && (
                    <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
                      … và {validRows.length - PREVIEW_LIMIT} dòng khác.
                    </p>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" disabled={busy} onClick={() => handleOpenChange(false)}>
            Đóng
          </Button>
          {!result && (
            <Button type="button" disabled={busy || validRows.length === 0} onClick={handleImport}>
              {busy && progress > 0 ? `Đang nhập ${progress}/${validRows.length}...` : `Nhập ${validRows.length} sản phẩm`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
