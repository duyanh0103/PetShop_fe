import { useCallback, useEffect, useMemo, useState } from "react";

import productService from "../services/productService";
import useDebouncedValue from "@/hooks/useDebouncedValue";

const DEFAULT_PAGE_SIZE = 10;

/**
 * Server-driven list state for the Product admin page: pagination, search
 * (name + SKU), categoryId filter, isActive filter and sort are all
 * delegated to the backend.
 */
export default function useProducts() {
  // `requestKey` records which query the stored result belongs to, so
  // `loading` can be derived instead of set synchronously inside an effect.
  const [result, setResult] = useState({
    requestKey: null,
    products: [],
    pagination: { total: 0, totalPages: 1 },
    error: null,
  });
  const [reloadToken, setReloadToken] = useState(0);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isActive, setIsActive] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy] = useState("createdAt");
  const [sortDir] = useState("desc");

  const debouncedSearch = useDebouncedValue(search, 400);

  // Any filter/search change should reset back to page 1. Adjusting state
  // during render avoids an extra fetch of the old page with the new filters.
  const filterKey = JSON.stringify([debouncedSearch, selectedCategory, isActive]);
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
      categoryId: selectedCategory,
      isActive,
      sortBy,
      sortDir,
    }),
    [page, pageSize, debouncedSearch, selectedCategory, isActive, sortBy, sortDir]
  );
  const requestKey = JSON.stringify([params, reloadToken]);

  useEffect(() => {
    let ignore = false;

    productService
      .getProducts(params)
      .then((data) => {
        if (ignore) return;
        setResult({
          requestKey,
          products: data.items,
          pagination: data.pagination,
          error: null,
        });
      })
      .catch((err) => {
        if (ignore) return;
        setResult((prev) => ({
          ...prev,
          requestKey,
          error: err.response?.data?.message ?? "Failed to load products",
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
  const { products, pagination } = result;

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
    products,
    loading,
    error,
    search,
    selectedCategory,
    isActive,
    page,
    pageSize,
    totalPages,
    totalItems: total,
    startItem,
    endItem,
    setSearch,
    setSelectedCategory,
    setIsActive,
    setPage,
    setPageSize,
    refetch,
  };
}
