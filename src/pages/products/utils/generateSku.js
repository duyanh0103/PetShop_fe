const CATEGORY_CODE_MAP = {
  DOG_FOOD: "DOG",
  CAT_FOOD: "CAT",
  ACCESSORIES: "ACC",
  PET_TOYS: "TOY",
  MEDICINE: "MED",
  DOG: "DOG",
  CAT: "CAT",
  ACC: "ACC",
  TOY: "TOY",
  MED: "MED",
};

function normalizeCategoryValue(category) {
  return String(category ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getCategoryCode(category) {
  const normalizedCategory = normalizeCategoryValue(category);
  return CATEGORY_CODE_MAP[normalizedCategory] || normalizedCategory || "SKU";
}

function extractRunningNumber(sku) {
  if (!sku) {
    return 0;
  }

  const parts = String(sku).split("-");
  const lastPart = parts[parts.length - 1] ?? "";
  const parsed = Number(lastPart);

  return Number.isNaN(parsed) ? 0 : parsed;
}

export function generateSku(category, products = []) {
  if (!category) {
    return "";
  }

  const categoryCode = getCategoryCode(category);

  if (!categoryCode) {
    return "";
  }

  const highestRunningNumber = products.reduce((maxNumber, product) => {
    const currentSku = product?.sku;

    if (!currentSku) {
      return maxNumber;
    }

    return Math.max(maxNumber, extractRunningNumber(currentSku));
  }, 0);

  const nextRunningNumber = highestRunningNumber + 1;
  return `${categoryCode}-${String(nextRunningNumber).padStart(4, "0")}`;
}

export default generateSku;
