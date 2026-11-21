import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import productSchema, { createProductSchema } from "@/pages/products/schemas/productSchema";
import { zodResolver } from "@/lib/zodResolver";

const defaultProductFormValues = {
  productName: "",
  sku: "",
  categoryIds: [],
  price: 0,
  quantity: 0,
  description: "",
  imageUrl: "",
  isActive: true,
};

function parseNumericValue(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const normalized = String(value).replace(/,/g, "");
  const parsed = Number(normalized);

  return Number.isNaN(parsed) ? "" : parsed;
}

function normalizeDefaultValues(defaultValues) {
  return {
    ...defaultProductFormValues,
    ...defaultValues,
    price: parseNumericValue(defaultValues?.price),
    quantity: parseNumericValue(defaultValues?.quantity),
    description: defaultValues?.description ?? "",
    imageUrl: defaultValues?.imageUrl ?? "",
    isActive: defaultValues?.isActive ?? true,
  };
}

export function useProductForm({
  defaultValues,
  onSubmit,
  loading = false,
  isEditMode = false,
}) {
  const normalizedDefaultValues = useMemo(
    () => normalizeDefaultValues(defaultValues),
    [defaultValues]
  );
  const defaultValuesKey = useMemo(
    () => JSON.stringify(normalizedDefaultValues),
    [normalizedDefaultValues]
  );

  const form = useForm({
    resolver: zodResolver(isEditMode ? productSchema : createProductSchema),
    defaultValues: normalizedDefaultValues,
    mode: "onTouched",
  });

  const { reset, handleSubmit, control, register, formState } = form;

  useEffect(() => {
    reset(normalizedDefaultValues);
  }, [defaultValuesKey, normalizedDefaultValues, reset]);

  const submitHandler = handleSubmit(async (values) => {
    const normalizedValues = {
      ...values,
      sku: String(values.sku ?? "").trim().toUpperCase(),
      description: values.description || undefined,
      imageUrl: values.imageUrl || undefined,
    };

    await onSubmit?.(normalizedValues);
  });

  return {
    control,
    register,
    formState,
    handleSubmit: submitHandler,
    loading,
  };
}

export { defaultProductFormValues };
