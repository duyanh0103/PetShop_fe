import axios from "axios";

import api from "./api";

export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";
const ALLOWED_TYPES = new Set(IMAGE_ACCEPT.split(","));

/** Checked before asking for a signature; Cloudinary cannot cap size on a signed upload. */
export function validateImageFile(file, maxFileSize = 2 * 1024 * 1024) {
  if (!ALLOWED_TYPES.has(file.type)) return "Chỉ nhận ảnh JPG, PNG hoặc WEBP";
  if (file.size > maxFileSize) return `Ảnh tối đa ${Math.round(maxFileSize / 1024 / 1024)} MB`;
  return null;
}

const uploadService = {
  /**
   * Uploads straight from the browser to Cloudinary with a signature from our
   * API, so the file never passes through the backend. Resolves to the
   * image's https URL.
   */
  async uploadImage(file, { onProgress, signal } = {}) {
    const response = await api.post("/admin/uploads/signature");
    const signed = response.data.data;

    const message = validateImageFile(file, signed.maxFileSize);
    if (message) throw new Error(message);

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", signed.apiKey);
    form.append("timestamp", String(signed.timestamp));
    form.append("signature", signed.signature);
    form.append("folder", signed.folder);
    form.append("allowed_formats", signed.allowedFormats);

    // Plain axios: this request must not carry our JWT to a third party.
    const uploaded = await axios.post(signed.uploadUrl, form, {
      signal,
      onUploadProgress: (event) => {
        if (onProgress && event.total) onProgress(Math.round((event.loaded / event.total) * 100));
      },
    });

    return uploaded.data.secure_url;
  },
};

export default uploadService;
