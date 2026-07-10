import { Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductImageUpload from "./ProductImageUpload";

const categoryOptions = [
  { label: "Dog Food", value: "DOG_FOOD" },
  { label: "Cat Food", value: "CAT_FOOD" },
  { label: "Accessories", value: "ACCESSORIES" },
  { label: "Pet Toys", value: "PET_TOYS" },
  { label: "Medicine", value: "MEDICINE" },
];

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Out Of Stock", value: "OUT_OF_STOCK" },
];

function FieldError({ message }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-destructive">{message}</p>;
}

function FormLabel({ children, htmlFor, required = false }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium text-foreground"
    >
      {children}
      {required ? <span className="ml-1 text-destructive">*</span> : null}
    </label>
  );
}

function PriceField({ control, disabled, error }) {
  const formatPrice = (value) => {
    if (value === null || value === undefined || value === "") {
      return "";
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return "";
    }

    return new Intl.NumberFormat("vi-VN").format(numericValue);
  };

  const parsePrice = (value) => {
    if (value === "") {
      return "";
    }

    const numericValue = Number(String(value).replace(/,/g, ""));
    return Number.isNaN(numericValue) ? "" : numericValue;
  };

  return (
    <Controller
      control={control}
      name="price"
      render={({ field }) => (
        <div className="space-y-2">
          <FormLabel htmlFor="product-price" required>
            Price
          </FormLabel>
          <Input
            id="product-price"
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={formatPrice(field.value)}
            onChange={(event) => field.onChange(parsePrice(event.target.value))}
            onBlur={field.onBlur}
            disabled={disabled}
          />
          <FieldError message={error?.message} />
        </div>
      )}
    />
  );
}

function SelectField({
  control,
  name,
  label,
  placeholder,
  options,
  required = false,
  error,
  disabled = false,
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="space-y-2">
          <FormLabel htmlFor={name} required={required}>
            {label}
          </FormLabel>
          <Select
            value={field.value ?? ""}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger id={name} className="h-10 w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={error?.message} />
        </div>
      )}
    />
  );
}

export default function ProductFormFields({
  control,
  register,
  errors,
  imagePreview,
  imageResetToken,
  onImageChange,
  onImageRemove,
  disabled = false,
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <FormLabel htmlFor="product-name" required>
            Product Name
          </FormLabel>
          <Input
            id="product-name"
            type="text"
            placeholder="Enter product name"
            disabled={disabled}
            aria-invalid={Boolean(errors.productName)}
            {...register("productName")}
          />
          <FieldError message={errors.productName?.message} />
        </div>

        <div className="space-y-2">
          <FormLabel htmlFor="product-sku" required>
            SKU
          </FormLabel>
          <Input
            id="product-sku"
            type="text"
            placeholder="Enter SKU"
            disabled={disabled}
            aria-invalid={Boolean(errors.sku)}
            {...register("sku")}
          />
          <FieldError message={errors.sku?.message} />
        </div>

        <SelectField
          control={control}
          name="category"
          label="Category"
          placeholder="Choose category"
          options={categoryOptions}
          required
          error={errors.category}
          disabled={disabled}
        />

        <SelectField
          control={control}
          name="status"
          label="Status"
          placeholder="Choose status"
          options={statusOptions}
          error={errors.status}
          disabled={disabled}
        />

        <PriceField
          control={control}
          disabled={disabled}
          error={errors.price}
        />

        <div className="space-y-2">
          <FormLabel htmlFor="product-stock" required>
            Stock
          </FormLabel>
          <Input
            id="product-stock"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            disabled={disabled}
            aria-invalid={Boolean(errors.stock)}
            {...register("stock", {
              setValueAs: (value) => {
                if (value === "" || value === null || value === undefined) {
                  return "";
                }

                const parsed = Number(value);
                return Number.isNaN(parsed) ? "" : parsed;
              },
            })}
          />
          <FieldError message={errors.stock?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="product-description">Description</FormLabel>
        <textarea
          id="product-description"
          rows={5}
          placeholder="Write a short product description"
          disabled={disabled}
          aria-invalid={Boolean(errors.description)}
          className="flex min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
          {...register("description")}
        />
        <FieldError message={errors.description?.message} />
      </div>

      <ProductImageUpload
        preview={imagePreview}
        onChange={onImageChange}
        onRemove={onImageRemove}
        disabled={disabled}
        resetToken={imageResetToken}
      />
    </div>
  );
}
