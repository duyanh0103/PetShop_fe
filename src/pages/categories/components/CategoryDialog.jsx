import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CategoryForm from "./CategoryForm";

export default function CategoryDialog({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  loading = false,
  mode = "create",
  submitLabel = "Lưu danh mục",
}) {
  const isEditMode = mode === "edit";
  const title = isEditMode ? "Sửa danh mục" : "Thêm danh mục";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="pr-8 text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Điền thông tin danh mục bên dưới.
          </DialogDescription>
        </DialogHeader>

        <CategoryForm
          key={open ? "open" : "closed"}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange?.(false)}
          loading={loading}
          submitLabel={submitLabel}
        />
      </DialogContent>
    </Dialog>
  );
}
