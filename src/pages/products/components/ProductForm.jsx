import ProductFormFields from "./ProductFormFields";
import ProductFormFooter from "./ProductFormFooter";
import { useProductForm } from "../hooks/useProductForm";

export default function ProductForm({
  defaultValues,
  onSubmit,
  onCancel,
  loading = false,
  products = [],
  isEditMode = false,
  submitLabel = "Save Product",
}) {
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    imagePreview,
    imageResetToken,
    updateImageFile,
    clearImageFile,
  } = useProductForm({
    defaultValues,
    onSubmit,
    loading,
    products,
    isEditMode,
  });

  const isDisabled = loading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProductFormFields
        control={control}
        register={register}
        errors={errors}
        imagePreview={imagePreview}
        imageResetToken={imageResetToken}
        onImageChange={updateImageFile}
        onImageRemove={clearImageFile}
        disabled={isDisabled}
        isEditMode={isEditMode}
      />

      <ProductFormFooter onCancel={onCancel} loading={isDisabled} submitLabel={submitLabel} />
    </form>
  );
}
