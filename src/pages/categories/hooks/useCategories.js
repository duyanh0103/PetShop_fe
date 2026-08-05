import { useCallback, useEffect, useState } from "react";

import categoryService from "../services/categoryService";
import useDebouncedValue from "@/hooks/useDebouncedValue";

const DEFAULT_PAGE_SIZE = 10;

/**
 * Server-driven list state for the Category admin page: pagination, search,
 * isActive filter and sort are all delegated to the backend (unlike the
 * Product page, which still filters/paginates a mock dataset client-side).
 */
export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy] = useState("sortOrder");
  const [sortDir] = useState("asc");

  const debouncedSearch = useDebouncedValue(search, 400);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await categoryService.getCategories({
        page,
        limit: pageSize,
        search: debouncedSearch,
        isActive,
        sortBy,
        sortDir,
      });

      setCategories(result.items);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, isActive, sortBy, sortDir]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Any filter/search change should reset back to page 1.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, isActive]);

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
    refetch: fetchCategories,
  };
}
