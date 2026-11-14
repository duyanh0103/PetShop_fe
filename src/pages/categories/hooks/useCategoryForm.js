import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@/lib/zodResolver";
import { slugify } from "@/lib/slugify";

import categorySchema from "../schemas/categorySchema";

const defaultCategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  sortOrder: 0,
  type: "CATEGORY",
  isActive: true,
};

function normalizeDefaultValues(defaultValues) {
  return {
    ...defaultCategoryFormValues,
    ...defaultValues,
  };
}

export function useCategoryForm({ defaultValues, onSubmit, loading = false }) {
  const normalizedDefaultValues = useMemo(
    () => normalizeDefaultValues(defaultValues),
    [defaultValues]
  );
  const defaultValuesKey = useMemo(
    () => JSON.stringify(normalizedDefaultValues),
    [normalizedDefaultValues]
  );

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: normalizedDefaultValues,
    mode: "onTouched",
  });

  const { reset, watch, setValue, handleSubmit, register, control, formState } = form;

  useEffect(() => {
    reset(normalizedDefaultValues);
  }, [defaultValuesKey, normalizedDefaultValues, reset]);

  const nameValue = watch("name");
  const slugValue = watch("slug");

  // Live slug preview, create-mode only: if this category already has a
  // slug (editing an existing one), never auto-overwrite it just because the
  // dialog was reopened — that would silently erase a hand-edited slug/URL.
  // In create mode (no initial slug) we auto-suggest from the name until the
  // user manually edits the slug field themselves.
  const initialSlugPresent = useMemo(
    () => Boolean(normalizedDefaultValues.slug),
    [normalizedDefaultValues]
  );
  const slugTouched = formState.dirtyFields.slug;

  useEffect(() => {
    if (initialSlugPresent || slugTouched) return;

    const suggested = slugify(nameValue || "");
    setValue("slug", suggested, { shouldValidate: false });
  }, [nameValue, slugTouched, initialSlugPresent, setValue]);

  const submitHandler = handleSubmit(async (values) => {
    const payload = {
      ...values,
      slug: values.slug ? values.slug : undefined,
      description: values.description || undefined,
      imageUrl: values.imageUrl || undefined,
    };

    await onSubmit?.(payload);
  });

  return {
    register,
    control,
    formState,
    handleSubmit: submitHandler,
    slugPreview: slugValue,
    loading,
  };
}

export { defaultCategoryFormValues };
