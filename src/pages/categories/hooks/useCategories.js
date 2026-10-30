import { useCallback, useEffect, useMemo, useState } from "react";

import categoryService from "../services/categoryService";
import useDebouncedValue from "@/hooks/useDebouncedValue";

const DEFAULT_PAGE_SIZE = 10;

/**
 * Server-driven list state for the Category admin page: pagination, search,
 * isActive filter and sort are all delegated to the backend (unlike the
 * Product page, which still filters/paginates a mock dataset client-side).
 */
export default function useCategories() {
  // `requestKey` records which query the stored result belongs to, so
  // `loading` can be derived instead of set synchronously inside an effect.
  const [result, setResult] = useState({
    requestKey: null,
    categories: [],
    pagination: { total: 0, totalPages: 1 },
    error: null,
  });
  const [reloadToken, setReloadToken] = useState(0);

  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy] = useState("sortOrder");
  const [sortDir] = useState("asc");

  const debouncedSearch = useDebouncedValue(search, 400);

  // Any filter/search change should reset back to page 1. Adjusting state
  // during render avoids an extra fetch of the old page with the new filters.
  const filterKey = JSON.stringify([debouncedSearch, isActive]);
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const params = useMemo(
    () => ({
      page,
      limit: pageSize,
      search: debouncedSearch,
      isActive,
      sortBy,
      sortDir,
    }),
    [page, pageSize, debouncedSearch, isActive, sortBy, sortDir]
  );
  const requestKey = JSON.stringify([params, reloadToken]);

  useEffect(() => {
    let ignore = false;

    categoryService
      .getCategories(params)
      .then((data) => {
        if (ignore) return;
        setResult({
          requestKey,
          categories: data.items,
          pagination: data.pagination,
          error: null,
        });
      })
      .catch((err) => {
        if (ignore) return;
        setResult((prev) => ({
          ...prev,
          requestKey,
          error: err.response?.data?.message ?? "Failed to load categories",
        }));
      });

    // Drop responses from superseded requests (e.g. fast typing in search).
    return () => {
      ignore = true;
    };
  }, [params, requestKey]);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  const loading = result.requestKey !== requestKey;
  const error = loading ? null : result.error;
  const { categories, pagination } = result;

  const setPageSize = (value) => {
    const nextPageSize = Number(value);

    if (!Number.isNaN(nextPageSize) && nextPageSize > 0) {
      setPageSizeState(nextPageSize);
      setPage(1);
    }
  };

  const total = pagination.total ?? 0;
  const totalPages = pagination.totalPages ?? 1;
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = total === 0 ? 0 : Math.min(page * pageSize, total);

  return {
    categories,
    loading,
    error,
    search,
    isActive,
    page,
    pageSize,
    totalPages,
    totalItems: total,
    startItem,
    endItem,
    setSearch,
    setIsActive,
    setPage,
    setPageSize,
    refetch,
  };
}
