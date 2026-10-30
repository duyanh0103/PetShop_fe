/**
 * Derive a short 3-letter SKU prefix from a category name.
 * Diacritic-insensitive (Vietnamese-friendly): strips accents, drops spaces
 * and punctuation, then takes the first 3 letters.
 *   "Thức ăn cho chó" -> "THU"
 *   "Đồ chơi"          -> "DOC"
 */
function getCategoryCode(categoryName) {
  const normalized = categoryName
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/đ/gi, "d") // Vietnamese "đ" is not decomposed by NFD
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

  return normalized.slice(0, 3) || "SKU";
}

function extractRunningNumber(sku, prefix) {
  if (!sku) {
    return 0;
  }

  const match = String(sku)
    .toUpperCase()
    .match(new RegExp(`^${prefix}-(\\d+)$`));

  if (!match) {
    return 0;
  }

  const parsed = Number(match[1]);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function generateSku(categoryName, products = []) {
  if (!categoryName) {
    return "";
  }

  const categoryCode = getCategoryCode(categoryName);

  if (!categoryCode) {
    return "";
  }

  // Only look at SKUs that already use this exact prefix, so the running
  // number is scoped per category code instead of drifting across
  // unrelated categories that happen to share a 3-letter code.
  const highestRunningNumber = products.reduce((maxNumber, product) => {
    return Math.max(maxNumber, extractRunningNumber(product?.sku, categoryCode));
  }, 0);

  const nextRunningNumber = highestRunningNumber + 1;
  return `${categoryCode}-${String(nextRunningNumber).padStart(4, "0")}`;
}

export default generateSku;
