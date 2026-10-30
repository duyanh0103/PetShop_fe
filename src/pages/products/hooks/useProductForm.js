import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import productSchema from "@/pages/products/schemas/productSchema";
import { generateSku } from "@/pages/products/utils/generateSku";
import { zodResolver } from "@/lib/zodResolver";

const defaultProductFormValues = {
  productName: "",
  sku: "",
  categoryId: "",
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
  products = [],
  categories = [],
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
    resolver: zodResolver(productSchema),
    defaultValues: normalizedDefaultValues,
    mode: "onTouched",
  });

  const { reset, setValue, handleSubmit, control, register, formState, watch } = form;

  useEffect(() => {
    reset(normalizedDefaultValues);
  }, [defaultValuesKey, normalizedDefaultValues, reset]);

  const categoryIdValue = watch("categoryId");
  const skuValue = watch("sku");

  // Best-effort SKU suggestion only — the backend is the source of truth for
  // uniqueness (a 409 "SKU already exists" surfaces on submit if this guess
  // collides, e.g. because `products` here is only the current page).
  useEffect(() => {
    if (isEditMode) {
      return;
    }

    if (skuValue && skuValue.trim().length > 0) {
      return;
    }

    const selectedCategory = categories.find((category) => category.id === categoryIdValue);
    const suggestedSku = generateSku(selectedCategory?.name, products);

    if (suggestedSku) {
      setValue("sku", suggestedSku, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [categoryIdValue, categories, isEditMode, products, setValue, skuValue]);

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
