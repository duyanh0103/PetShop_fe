// 1 … 4 5 6 … 12: first, last, and the pages next to the current one.
export function pageItems(page, totalPages) {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);

  return sorted.flatMap((n, index) => (index > 0 && n - sorted[index - 1] > 1 ? ["gap" + n, n] : [n]));
}
