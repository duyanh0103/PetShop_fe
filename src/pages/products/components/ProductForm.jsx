import ProductFormFields from "./ProductFormFields";
import ProductFormFooter from "./ProductFormFooter";
import { useProductForm } from "../hooks/useProductForm";

export default function ProductForm({
  defaultValues,
  onSubmit,
  onCancel,
  loading = false,
  categories = [],
  isEditMode = false,
  submitLabel = "Save Product",
}) {
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useProductForm({
    defaultValues,
    onSubmit,
    loading,
    categories,
    isEditMode,
  });

  const isDisabled = loading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProductFormFields
        control={control}
        register={register}
        errors={errors}
        categories={categories}
        disabled={isDisabled}
        isEditMode={isEditMode}
      />

      <ProductFormFooter onCancel={onCancel} loading={isDisabled} submitLabel={submitLabel} />
    </form>
  );
}
