/**
 * Client-side mirror of petshop-be's src/utils/slug.util.js — used only for
 * a live preview while typing. The backend always recomputes/owns the final
 * slug (and its uniqueness), this is cosmetic only.
 */
export function slugify(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/đ/gi, "d") // Vietnamese "đ" is not decomposed by NFD
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default slugify;
