import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";

export default function CategoryDeleteDialog({
  open,
  onOpenChange,
  category,
  onConfirm,
  loading = false,
  errorMessage = "",
}) {
  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-[2px]" />
        <AlertDialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[min(96%,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-white p-6 shadow-xl">
          <AlertDialogPrimitive.Title className="text-lg font-semibold text-foreground">Xóa danh mục</AlertDialogPrimitive.Title>

          <AlertDialogPrimitive.Description className="mt-2 text-sm text-muted-foreground">
            Bạn có chắc chắn muốn xóa "{category?.name}"?
            <br />
            Hành động này không thể hoàn tác.
          </AlertDialogPrimitive.Description>

          {errorMessage ? (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <div className="mt-6 flex justify-end gap-3">
            <AlertDialogPrimitive.Cancel asChild>
              <Button variant="outline">Hủy</Button>
            </AlertDialogPrimitive.Cancel>

            <AlertDialogPrimitive.Action asChild>
              <Button
                variant="destructive"
                onClick={() => onConfirm?.(category?.id)}
                disabled={loading}
              >
                {loading ? "Đang xóa..." : "Xóa"}
              </Button>
            </AlertDialogPrimitive.Action>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
