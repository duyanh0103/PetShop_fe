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
  if (!message) return null;
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

export default function CategoryFormFields({
  control,
  register,
  errors,
  disabled = false,
  slugPreview = "",
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <FormLabel htmlFor="category-name" required>
            Tên danh mục
          </FormLabel>
          <Input
            id="category-name"
            type="text"
            placeholder="VD: Thức ăn cho chó"
            disabled={disabled}
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div className="space-y-2">
          <FormLabel htmlFor="category-slug">Slug</FormLabel>
          <Input
            id="category-slug"
            type="text"
            placeholder="tự-động-sinh-từ-tên"
            disabled={disabled}
            aria-invalid={Boolean(errors.slug)}
            {...register("slug")}
          />
          <p className="text-xs text-muted-foreground">
            URL: /{slugPreview || "..."}
          </p>
          <FieldError message={errors.slug?.message} />
        </div>

        <div className="space-y-2">
          <FormLabel htmlFor="category-sort-order">Thứ tự sắp xếp</FormLabel>
          <Input
            id="category-sort-order"
            type="number"
            step="1"
            placeholder="0"
            disabled={disabled}
            aria-invalid={Boolean(errors.sortOrder)}
            {...register("sortOrder")}
          />
          <FieldError message={errors.sortOrder?.message} />
        </div>

        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <div className="space-y-2">
              <FormLabel htmlFor="category-type">Loại</FormLabel>
              <Select value={field.value || "CATEGORY"} onValueChange={field.onChange} disabled={disabled}>
                <SelectTrigger id="category-type" className="h-10 w-full">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CATEGORY">Danh mục</SelectItem>
                  <SelectItem value="BRAND">Thương hiệu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />

        <Controller
          control={control}
          name="isActive"
          render={({ field }) => (
            <div className="space-y-2">
              <FormLabel htmlFor="category-status">Trạng thái</FormLabel>
              <Select
                value={field.value ? "true" : "false"}
                onValueChange={(value) => field.onChange(value === "true")}
                disabled={disabled}
              >
                <SelectTrigger id="category-status" className="h-10 w-full">
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

        <div className="lg:col-span-2">
          <ImageUrlField
            control={control}
            id="category-image-url"
            label="Ảnh danh mục"
            error={errors.imageUrl}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="category-description">Mô tả</FormLabel>
        <textarea
          id="category-description"
          rows={4}
          placeholder="Nhập mô tả ngắn cho danh mục"
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
