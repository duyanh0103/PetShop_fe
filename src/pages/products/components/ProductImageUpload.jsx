import { useEffect, useRef } from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ProductImageUpload({
  preview,
  onChange,
  onRemove,
  disabled = false,
  resetToken = 0,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [resetToken]);

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];
    onChange?.(file ?? null);
  };

  const handleRemove = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onRemove?.();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <label className="text-sm font-medium text-foreground">
            Image
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose a local image only. Preview updates immediately.
          </p>
        </div>

        {preview ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={disabled}
            className="text-muted-foreground"
          >
            <X className="size-4" />
            Remove
          </Button>
        ) : null}
      </div>

      <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 p-4">
        {preview ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <img
              src={preview}
              alt="Product preview"
              className="h-40 w-full rounded-lg object-cover sm:h-32 sm:w-32"
            />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ImageIcon className="size-4 text-muted-foreground" />
                Image preview ready
              </div>
              <p className="max-w-md text-sm text-muted-foreground">
                This image is stored locally for now. When API upload is wired in
                later, we can send this file directly.
              </p>

              <div className="flex flex-wrap gap-2">
                <label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                    asChild
                  >
                    <span className="cursor-pointer">
                      <Upload className="size-4" />
                      Replace image
                    </span>
                  </Button>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleInputChange}
                    disabled={disabled}
                  />
                </label>
              </div>
            </div>
          </div>
        ) : (
          <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border/60 bg-background px-4 py-8 text-center transition hover:border-primary/40 hover:bg-primary/5">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Upload className="size-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Upload product image
              </p>
              <p className="text-sm text-muted-foreground">
                JPG, PNG, WEBP supported
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm">
              Choose file
            </span>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInputChange}
              disabled={disabled}
            />
          </label>
        )}
      </div>
    </div>
  );
}
