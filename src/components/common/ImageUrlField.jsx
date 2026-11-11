import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { ImageOff, Loader2, Upload } from "lucide-react";

import PawIcon from "@/components/brand/PawIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { imageUrl } from "@/lib/image";
import uploadService, { IMAGE_ACCEPT, validateImageFile } from "@/services/uploadService";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-[13px] font-bold text-danger-text">{message}</p>;
}

function uploadErrorMessage(error) {
  if (error.name === "CanceledError") return null;
  // Our API (signature) answers { message }, Cloudinary answers { error: { message } }.
  const data = error.response?.data;
  const detail = data?.message ?? data?.error?.message ?? error.message;
  return detail ? `Không tải được ảnh: ${detail}` : "Không tải được ảnh. Vui lòng thử lại.";
}

/**
 * Image field shared by the Product and Category forms: upload a file to
 * Cloudinary (the URL is filled in for you) or paste any image URL.
 */
export default function ImageUrlField({
  control,
  name = "imageUrl",
  label = "Ảnh",
  id,
  error,
  disabled = false,
  placeholder = "https://...",
}) {
  const [previewFailed, setPreviewFailed] = useState(false);
  const [progress, setProgress] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const fieldId = id || name;
  const uploading = progress !== null;

  // Closing the form mid-upload must not write into an unmounted form.
  useEffect(() => () => abortRef.current?.abort(), []);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const url = (field.value ?? "").trim();

        const handleFile = async (file) => {
          if (!file) return;
          setUploadError("");

          const invalid = validateImageFile(file);
          if (invalid) {
            setUploadError(invalid);
            return;
          }

          const controller = new AbortController();
          abortRef.current = controller;
          setProgress(0);

          try {
            const uploadedUrl = await uploadService.uploadImage(file, {
              onProgress: setProgress,
              signal: controller.signal,
            });
            setPreviewFailed(false);
            field.onChange(uploadedUrl);
          } catch (uploadFailure) {
            const message = uploadErrorMessage(uploadFailure);
            if (message) setUploadError(message);
          } finally {
            setProgress(null);
            if (inputRef.current) inputRef.current.value = "";
          }
        };

        return (
          <div className="flex flex-col gap-2">
            <label htmlFor={fieldId} className="text-sm font-bold text-foreground">
              {label}
            </label>

            <div className="flex items-stretch gap-3">
              <div className="flex size-[88px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-tile text-tile-icon">
                {url && !previewFailed ? (
                  <img
                    src={imageUrl(url, 200)}
                    alt="Xem trước ảnh"
                    className="h-full w-full object-cover"
                    onError={() => setPreviewFailed(true)}
                  />
                ) : url ? (
                  <ImageOff className="size-6" aria-label="Không xem trước được ảnh" />
                ) : (
                  <PawIcon size={30} />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Input
                  id={fieldId}
                  type="text"
                  inputMode="url"
                  aria-label={`${label} (URL)`}
                  placeholder={placeholder}
                  disabled={disabled || uploading}
                  aria-invalid={Boolean(error)}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    setPreviewFailed(false);
                    field.onChange(event.target.value);
                  }}
                  onBlur={field.onBlur}
                />

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-xl border-[1.5px] border-dashed border-input px-3 py-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={disabled || uploading}
                    onClick={() => inputRef.current?.click()}
                  >
                    {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
                    {uploading ? `Đang tải ${progress}%` : url ? "Đổi ảnh" : "Tải ảnh lên"}
                  </Button>
                  <span className="text-[13px] text-muted-foreground">JPG, PNG, WEBP · tối đa 2 MB</span>
                  <input
                    ref={inputRef}
                    type="file"
                    accept={IMAGE_ACCEPT}
                    className="hidden"
                    tabIndex={-1}
                    onChange={(event) => handleFile(event.target.files?.[0])}
                  />
                </div>

                {uploading ? (
                  <div
                    className="h-1.5 overflow-hidden rounded-full bg-pastel"
                    role="progressbar"
                    aria-label="Tiến độ tải ảnh"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
                  </div>
                ) : null}

                <FieldError message={uploadError || error?.message} />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
