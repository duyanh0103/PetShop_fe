import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import productSchema from "@/pages/products/schemas/productSchema";
import productService from "@/pages/products/services/productService";
import { getCategoryCode } from "@/pages/products/utils/generateSku";
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

  const { reset, setValue, getValues, handleSubmit, control, register, formState, watch } = form;

  useEffect(() => {
    reset(normalizedDefaultValues);
  }, [defaultValuesKey, normalizedDefaultValues, reset]);

  const categoryIdsValue = watch("categoryIds");
  const skuValue = watch("sku");

  // Suggest the next free SKU for the chosen category. The API counts every
  // product; the unique index still has the last word (409 on submit).
  useEffect(() => {
    if (isEditMode || (skuValue && skuValue.trim().length > 0)) {
      return undefined;
    }

    // Prefix the SKU from a real category (not a brand) when one is selected.
    const selected = (categoryIdsValue ?? [])
      .map((id) => categories.find((category) => category.id === id))
      .filter(Boolean);
    const selectedCategory = selected.find((category) => category.type !== "BRAND") ?? selected[0];
    if (!selectedCategory) {
      return undefined;
    }

    const controller = new AbortController();

    productService
      .getNextSku(getCategoryCode(selectedCategory.name), { signal: controller.signal })
      .then((suggestedSku) => {
        // The admin may have typed a SKU while the request was in flight.
        if (!getValues("sku")?.trim()) {
          setValue("sku", suggestedSku, { shouldDirty: true, shouldValidate: true });
        }
      })
      .catch(() => {
        // A suggestion is optional; the admin can always type one.
      });

    return () => controller.abort();
  }, [categoryIdsValue, categories, getValues, isEditMode, setValue, skuValue]);

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
