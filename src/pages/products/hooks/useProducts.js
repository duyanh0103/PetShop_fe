import { useCallback, useEffect, useState } from "react";

import productService from "../services/productService";
import useDebouncedValue from "@/hooks/useDebouncedValue";

const DEFAULT_PAGE_SIZE = 10;

/**
 * Server-driven list state for the Product admin page: pagination, search
 * (name + SKU), categoryId filter, isActive filter and sort are all
 * delegated to the backend.
 */
export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isActive, setIsActive] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy] = useState("createdAt");
  const [sortDir] = useState("desc");

  const debouncedSearch = useDebouncedValue(search, 400);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await productService.getProducts({
        page,
        limit: pageSize,
        search: debouncedSearch,
        categoryId: selectedCategory,
        isActive,
        sortBy,
        sortDir,
      });

      setProducts(result.items);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, selectedCategory, isActive, sortBy, sortDir]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Any filter/search change should reset back to page 1.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory, isActive]);

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
    refetch: fetchProducts,
  };
}
