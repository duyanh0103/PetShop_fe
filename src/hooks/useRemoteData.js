import { useCallback, useEffect, useState } from "react";

/**
 * Loads data from `fetcher` whenever `key` changes, with the same
 * derived-loading / stale-response handling as useProducts:
 *
 *   const { data, loading, error, refetch } = useRemoteData(
 *     JSON.stringify(params),
 *     () => publicService.getProducts(params)
 *   );
 *
 * `key` must be a string that changes whenever the request changes; the
 * fetcher itself is not a dependency, so it can be an inline closure.
 */
export default function useRemoteData(key, fetcher, fallbackError = "Không tải được dữ liệu") {
  const [result, setResult] = useState({ requestKey: null, data: null, error: null });
  const [reloadToken, setReloadToken] = useState(0);

  const requestKey = `${key}#${reloadToken}`;

  useEffect(() => {
    let ignore = false;

    fetcher()
      .then((data) => {
        if (!ignore) setResult({ requestKey, data, error: null });
      })
      .catch((err) => {
        if (ignore) return;
        setResult({
          requestKey,
          data: null,
          error: {
            status: err.response?.status ?? null,
            message: err.response?.data?.message ?? fallbackError,
          },
        });
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by requestKey
  }, [requestKey]);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  const loading = result.requestKey !== requestKey;

  return {
    data: loading ? null : result.data,
    error: loading ? null : result.error,
    loading,
    refetch,
  };
}
