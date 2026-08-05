import { useEffect, useState } from "react";

/**
 * Returns `value`, but updated only after it has stopped changing for
 * `delayMs`. Used to avoid firing an API request on every keystroke in
 * search inputs (Category list, and future server-backed list pages).
 */
export default function useDebouncedValue(value, delayMs = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
