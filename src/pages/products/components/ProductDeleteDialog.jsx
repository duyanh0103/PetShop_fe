import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProductDeleteDialog({
  open,
  onOpenChange,
  product,
  onConfirm,
  loading = false,
}) {
  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-[2px]" />
        <AlertDialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[min(96%,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-white p-6 shadow-xl">
          <AlertDialogPrimitive.Title className="text-lg font-semibold text-foreground">Delete Product</AlertDialogPrimitive.Title>

          <AlertDialogPrimitive.Description className="mt-2 text-sm text-muted-foreground">
            Are you sure you want to delete this product?
            <br />
            This action cannot be undone.
          </AlertDialogPrimitive.Description>

          <div className="mt-6 flex justify-end gap-3">
            <AlertDialogPrimitive.Cancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogPrimitive.Cancel>

            <AlertDialogPrimitive.Action asChild>
              <Button variant="destructive" onClick={() => onConfirm?.(product?.id)} disabled={loading}>
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogPrimitive.Action>
          </div>

          <AlertDialogPrimitive.Cancel />
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
