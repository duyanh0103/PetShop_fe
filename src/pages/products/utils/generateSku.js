/**
 * Derive a short 3-letter SKU prefix from a category name; the running
 * number after it comes from the API (productService.getNextSku).
 * Diacritic-insensitive (Vietnamese-friendly): strips accents, drops spaces
 * and punctuation, then takes the first 3 letters.
 *   "Thức ăn cho chó" -> "THU"
 *   "Đồ chơi"          -> "DOC"
 */
export function getCategoryCode(categoryName) {
  const normalized = categoryName
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/đ/gi, "d") // Vietnamese "đ" is not decomposed by NFD
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

  return normalized.slice(0, 3) || "SKU";
}
