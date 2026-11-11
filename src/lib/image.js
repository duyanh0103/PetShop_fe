const CLOUDINARY_UPLOAD = "res.cloudinary.com/";

/**
 * Cloudinary URL resized for display: modern format, auto quality, never
 * upscaled. Other URLs (pasted links) are returned unchanged.
 */
export function imageUrl(url, width) {
  if (!url || !url.includes(CLOUDINARY_UPLOAD) || !url.includes("/image/upload/")) return url;
  return url.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);
}
