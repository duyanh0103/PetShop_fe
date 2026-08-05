import { Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
            Category Name
          </FormLabel>
          <Input
            id="category-name"
            type="text"
            placeholder="e.g. Dog Food"
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
            placeholder="auto-generated-from-name"
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
          <FormLabel htmlFor="category-sort-order">Sort Order</FormLabel>
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
          name="isActive"
          render={({ field }) => (
            <div className="space-y-2">
              <FormLabel htmlFor="category-status">Status</FormLabel>
              <Select
                value={field.value ? "true" : "false"}
                onValueChange={(value) => field.onChange(value === "true")}
                disabled={disabled}
              >
                <SelectTrigger id="category-status" className="h-10 w-full">
                  <SelectValue placeholder="Choose status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />

        <div className="space-y-2 lg:col-span-2">
          <FormLabel htmlFor="category-image-url">Image URL</FormLabel>
          <Input
            id="category-image-url"
            type="text"
            placeholder="https://..."
            disabled={disabled}
            aria-invalid={Boolean(errors.imageUrl)}
            {...register("imageUrl")}
          />
          <FieldError message={errors.imageUrl?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="category-description">Description</FormLabel>
        <textarea
          id="category-description"
          rows={4}
          placeholder="Write a short category description"
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
