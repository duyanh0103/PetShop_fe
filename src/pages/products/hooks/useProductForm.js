import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const productFormSchema = z.object({
  productName: z.string().trim().min(1, "Product Name is required"),
  sku: z.string().trim().min(1, "SKU is required"),
  category: z.string().trim().min(1, "Category is required"),
  price: z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }

      if (typeof value === "string") {
        const normalized = value.replace(/,/g, "");
        const parsed = Number(normalized);
        return Number.isNaN(parsed) ? undefined : parsed;
      }

      return value;
    },
    z
      .number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a number",
      })
      .min(0, "Price must be greater than or equal to 0")
  ),
  stock: z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }

      if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
      }

      return value;
    },
    z
      .number({
        required_error: "Stock is required",
        invalid_type_error: "Stock must be a number",
      })
      .int("Stock must be a whole number")
      .min(0, "Stock must be greater than or equal to 0")
  ),
  description: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"], {
    required_error: "Status is required",
  }),
  imageFile: z.any().nullable().optional(),
});

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
    resolver: zodResolver(productFormSchema),
    defaultValues: normalizedDefaultValues,
    mode: "onTouched",
  });

  const { reset, setValue, handleSubmit, control, register, formState } = form;
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

    setImagePreview("");
  };

  const clearImageFile = () => {
    updateImageFile(null);
  };

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit?.(values);
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

export { defaultProductFormValues, productFormSchema };
