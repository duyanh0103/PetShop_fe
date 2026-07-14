import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import productSchema from "@/pages/products/schemas/productSchema";
import { generateSku } from "@/pages/products/utils/generateSku";

function createProductFormSchema(products = [], currentProductId = null) {
  return productSchema.superRefine((value, context) => {
    const normalizedSku = String(value.sku ?? "").trim().toUpperCase();

    if (normalizedSku !== value.sku) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sku"],
        message: "SKU must be uppercase",
      });
    }

    const isDuplicate = products.some((product) => {
      if (!product?.sku) {
        return false;
      }

      if (currentProductId && Number(product.id) === Number(currentProductId)) {
        return false;
      }

      return String(product.sku).toUpperCase() === normalizedSku;
    });

    if (isDuplicate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sku"],
        message: "SKU already exists.",
      });
    }
  });
}

const defaultProductFormValues = {
  productName: "",
  sku: "",
  category: "",
  price: 0,
  stock: 0,
  description: "",
  status: "ACTIVE",
  imageFile: null,
};

function zodResolver(schema) {
  return async (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return {
        values: result.data,
        errors: {},
      };
    }

    const errors = result.error.issues.reduce((accumulator, issue) => {
      const path = issue.path.join(".");

      if (!path || accumulator[path]) {
        return accumulator;
      }

      accumulator[path] = {
        type: issue.code,
        message: issue.message,
      };

      return accumulator;
    }, {});

    return {
      values: {},
      errors,
    };
  };
}

function parseNumericValue(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const normalized = String(value).replace(/,/g, "");
  const parsed = Number(normalized);

  return Number.isNaN(parsed) ? "" : parsed;
}

function getImagePreview(defaultValues) {
  return (
    defaultValues?.imagePreview ||
    defaultValues?.imageUrl ||
    defaultValues?.image ||
    ""
  );
}

function normalizeDefaultValues(defaultValues) {
  return {
    ...defaultProductFormValues,
    ...defaultValues,
    price: parseNumericValue(defaultValues?.price),
    stock: parseNumericValue(defaultValues?.stock),
    description: defaultValues?.description ?? "",
    status: defaultValues?.status ?? "ACTIVE",
    imageFile: defaultValues?.imageFile ?? null,
  };
}

export function useProductForm({
  defaultValues,
  onSubmit,
  loading = false,
  products = [],
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

  const currentProductId = defaultValues?.id ?? null;
  const productFormSchema = useMemo(
    () => createProductFormSchema(products, currentProductId),
    [products, currentProductId]
  );

  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: normalizedDefaultValues,
    mode: "onTouched",
  });

  const { reset, setValue, handleSubmit, control, register, formState, watch } = form;
  const [imagePreview, setImagePreview] = useState(
    getImagePreview(defaultValues)
  );
  const [imageResetToken, setImageResetToken] = useState(0);
  const objectUrlRef = useRef("");

  useEffect(() => {
    reset(normalizedDefaultValues);
    setImagePreview(getImagePreview(defaultValues));
    setImageResetToken((current) => current + 1);

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = "";
    }
  }, [defaultValuesKey, defaultValues, normalizedDefaultValues, reset]);

  const categoryValue = watch("category");
  const skuValue = watch("sku");

  useEffect(() => {
    if (isEditMode) {
      return;
    }

    if (skuValue && skuValue.trim().length > 0) {
      return;
    }

    const suggestedSku = generateSku(categoryValue, products);

    if (suggestedSku) {
      setValue("sku", suggestedSku, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [categoryValue, isEditMode, products, setValue, skuValue]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const updateImageFile = (file) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = "";
    }

    setValue("imageFile", file ?? null, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      objectUrlRef.current = previewUrl;
      setImagePreview(previewUrl);
      return;
    }

    setImagePreview(getImagePreview(defaultValues));
  };

  const clearImageFile = () => {
    updateImageFile(null);
  };

  const submitHandler = handleSubmit(async (values) => {
    const normalizedValues = {
      ...values,
      sku: String(values.sku ?? "").trim().toUpperCase(),
    };

    await onSubmit?.(normalizedValues);
  });

  return {
    control,
    register,
    formState,
    handleSubmit: submitHandler,
    imagePreview,
    imageResetToken,
    updateImageFile,
    clearImageFile,
    loading,
  };
}

export { defaultProductFormValues };
