import CategoryFormFields from "./CategoryFormFields";
import CategoryFormFooter from "./CategoryFormFooter";
import { useCategoryForm } from "../hooks/useCategoryForm";

export default function CategoryForm({
  defaultValues,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = "Save Category",
}) {
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    slugPreview,
  } = useCategoryForm({ defaultValues, onSubmit, loading });

  const isDisabled = loading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CategoryFormFields
        control={control}
        register={register}
        errors={errors}
        disabled={isDisabled}
        slugPreview={slugPreview}
      />

      <CategoryFormFooter onCancel={onCancel} loading={isDisabled} submitLabel={submitLabel} />
    </form>
  );
}
