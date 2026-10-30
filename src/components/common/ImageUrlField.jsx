import { useState } from "react";
import { Controller } from "react-hook-form";
import { ImageOff } from "lucide-react";

import { Input } from "@/components/ui/input";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

/**
 * Text input for an image URL + a live preview thumbnail below it.
 * Shared by Category and Product forms so both look/behave identically —
 * there's no real upload endpoint yet, so this is URL-only for now (see
 * ProductImageUpload.jsx, kept but unused, for when upload is wired in).
 */
export default function ImageUrlField({
  control,
  name = "imageUrl",
  label = "Đường dẫn ảnh (URL)",
  id,
  error,
  disabled = false,
  placeholder = "https://...",
}) {
  const [previewFailed, setPreviewFailed] = useState(false);
  const fieldId = id || name;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const url = (field.value ?? "").trim();

        return (
          <div className="space-y-2">
            <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
              {label}
            </label>

            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <Input
                  id={fieldId}
                  type="text"
                  placeholder={placeholder}
                  disabled={disabled}
                  aria-invalid={Boolean(error)}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    setPreviewFailed(false);
                    field.onChange(event.target.value);
                  }}
                  onBlur={field.onBlur}
                />
                <FieldError message={error?.message} />
              </div>

              {url ? (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border/70 bg-muted/30">
                  {previewFailed ? (
                    <div className="flex flex-col items-center gap-0.5 text-muted-foreground">
                      <ImageOff className="size-4" />
                    </div>
                  ) : (
                    <img
                      src={url}
                      alt="Xem trước ảnh"
                      className="h-full w-full object-cover"
                      onError={() => setPreviewFailed(true)}
                    />
                  )}
                </div>
              ) : null}
            </div>
          </div>
        );
      }}
    />
  );
}
