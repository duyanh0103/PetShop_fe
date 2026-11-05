import { useState } from "react";

import useDebouncedValue from "@/hooks/useDebouncedValue";
import useRemoteData from "@/hooks/useRemoteData";
import orderService from "@/services/orderService";

/**
 * Prices the cart on the server. Rapid quantity clicks are debounced, and the
 * last quote stays on screen while a new one loads so totals don't flicker.
 * `updating` is true whenever the quote may not match the cart yet, so callers
 * must not allow checkout while it is set.
 */
export default function useCartQuote(items) {
  const liveKey = JSON.stringify(items.map(({ productId, quantity }) => [productId, quantity]));
  const debouncedKey = useDebouncedValue(liveKey, 300);

  const { data, loading, error, refetch } = useRemoteData(
    debouncedKey,
    () => {
      const requested = JSON.parse(debouncedKey).map(([productId, quantity]) => ({
        productId,
        quantity,
      }));

      return requested.length ? orderService.quote(requested) : Promise.resolve(null);
    },
    "Không tính được tiền giỏ hàng"
  );

  const [lastQuote, setLastQuote] = useState(null);
  if (data && data !== lastQuote) {
    setLastQuote(data);
  }

  return {
    quote: data ?? lastQuote,
    updating: loading || liveKey !== debouncedKey,
    error,
    refetch,
  };
}
