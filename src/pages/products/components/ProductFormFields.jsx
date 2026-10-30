import { Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUrlField from "@/components/common/ImageUrlField";

function FieldError({ message }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-destructive">{message}</p>;
}

function FormLabel({ children, htmlFor, required = false }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
      {children}
      {required ? <span className="ml-1 text-destructive">*</span> : null}
    </label>
  );
}

function PriceField({ control, disabled, error }) {
  const parsePrice = (value) => {
    const cleaned = value.replace(/[^\d]/g, "");

    if (!cleaned) return "";

    return parseInt(cleaned, 10);
  };

  const formatPrice = (value) => {
    if (value === "" || value == null) return "";

    return new Intl.NumberFormat("vi-VN").format(value);
  };

  return (
    <Controller
      control={control}
      name="price"
      render={({ field }) => (
        <div className="space-y-2">
          <FormLabel htmlFor="product-price" required>
            Giá
          </FormLabel>
          <Input
            id="product-price"
            type="text"
            inputMode="numeric"
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

export default function ProductFormFields({
  control,
  register,
  errors,
  categories = [],
  disabled = false,
  isEditMode = false,
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <FormLabel htmlFor="product-name" required>
            Tên sản phẩm
          </FormLabel>
          <Input
            id="product-name"
            type="text"
            placeholder="Nhập tên sản phẩm"
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
            placeholder="Nhập SKU"
            disabled={disabled || isEditMode}
            readOnly={isEditMode}
            aria-invalid={Boolean(errors.sku)}
            {...register("sku")}
          />
          <FieldError message={errors.sku?.message} />
        </div>

        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <div className="space-y-2">
              <FormLabel htmlFor="product-category" required>
                Danh mục
              </FormLabel>
              <Select
                value={field.value || ""}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger id="product-category" className="h-10 w-full">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.categoryId?.message} />
            </div>
          )}
        />

        <Controller
          control={control}
          name="isActive"
          render={({ field }) => (
            <div className="space-y-2">
              <FormLabel htmlFor="product-status">Trạng thái</FormLabel>
              <Select
                value={field.value ? "true" : "false"}
                onValueChange={(value) => field.onChange(value === "true")}
                disabled={disabled}
              >
                <SelectTrigger id="product-status" className="h-10 w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Hoạt động</SelectItem>
                  <SelectItem value="false">Ngừng hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />

        <PriceField
          control={control}
          disabled={disabled}
          error={errors.price}
        />

        <div className="space-y-2">
          <FormLabel htmlFor="product-quantity" required>
            Tồn kho
          </FormLabel>
          <Input
            id="product-quantity"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            disabled={disabled}
            aria-invalid={Boolean(errors.quantity)}
            {...register("quantity", {
              setValueAs: (value) => {
                if (value === "" || value === null || value === undefined) {
                  return "";
                }

                const parsed = Number(value);
                return Number.isNaN(parsed) ? "" : parsed;
              },
            })}
          />
          <FieldError message={errors.quantity?.message} />
        </div>

        <div className="lg:col-span-2">
          <ImageUrlField
            control={control}
            id="product-image-url"
            error={errors.imageUrl}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="product-description">Mô tả</FormLabel>
        <textarea
          id="product-description"
          rows={5}
          placeholder="Nhập mô tả ngắn cho sản phẩm"
          disabled={disabled}
          aria-invalid={Boolean(errors.description)}
          className="flex min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
          {...register("description")}
        />
        <FieldError message={errors.description?.message} />
      </div>
    </div>
  );
}
