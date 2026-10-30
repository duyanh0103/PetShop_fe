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
  categories = [],
  mode = "create",
  submitLabel = "Lưu sản phẩm",
}) {
  const isEditMode = mode === "edit";
  const title = isEditMode ? "Sửa sản phẩm" : "Thêm sản phẩm";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader className="pr-8 text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Điền thông tin sản phẩm bên dưới.
          </DialogDescription>
        </DialogHeader>

        <ProductForm
          key={open ? "open" : "closed"}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange?.(false)}
          loading={loading}
          products={products}
          categories={categories}
          isEditMode={isEditMode}
          submitLabel={submitLabel}
        />
      </DialogContent>
    </Dialog>
  );
}
