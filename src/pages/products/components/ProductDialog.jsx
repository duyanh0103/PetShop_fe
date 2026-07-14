import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ProductForm from "./ProductForm";

export default function ProductDialog({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  loading = false,
  products = [],
  mode = "create",
  submitLabel = "Save Product",
}) {
  const isEditMode = mode === "edit";
  const title = isEditMode ? "Edit Product" : "Add Product";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader className="pr-8 text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill in product information below.
          </DialogDescription>
        </DialogHeader>

        <ProductForm
          key={open ? "open" : "closed"}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange?.(false)}
          loading={loading}
          products={products}
          isEditMode={isEditMode}
          submitLabel={submitLabel}
        />
      </DialogContent>
    </Dialog>
  );
}
