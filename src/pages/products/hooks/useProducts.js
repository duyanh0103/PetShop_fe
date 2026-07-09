import { useEffect, useMemo, useState } from "react";

import productService from "../services/productService";

const DEFAULT_PAGE_SIZE = 10;

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(DEFAULT_PAGE_SIZE);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        const result = await productService.getProducts();

        if (isMounted) {
          setProducts(result);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizeValue = (value) =>
    String(value)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.sku.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "all" ||
        normalizeValue(product.category) === normalizeValue(selectedCategory);

      const matchesStatus =
        selectedStatus === "all" ||
        normalizeValue(product.status) === normalizeValue(selectedStatus);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, selectedCategory, selectedStatus]);

  const totalItems = filteredProducts.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);

  const paginatedProducts = useMemo(() => {
    const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages);
    const startIndex = (safePage - 1) * pageSize;

    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, page, pageSize, totalPages]);

  const currentItems = paginatedProducts.length;
  const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages);
  const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = totalItems === 0 ? 0 : Math.min(safePage * pageSize, totalItems);

  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, selectedStatus]);

  useEffect(() => {
    if (totalPages === 0) {
      setPage(1);
      return;
    }

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const setPageSize = (value) => {
    const nextPageSize = Number(value);

    if (!Number.isNaN(nextPageSize) && nextPageSize > 0) {
      setPageSizeState(nextPageSize);
      setPage(1);
    }
  };

  return {
    products,
    filteredProducts,
    paginatedProducts,
    loading,
    search,
    selectedCategory,
    selectedStatus,
    page,
    pageSize,
    totalPages,
    totalItems,
    currentItems,
    startItem,
    endItem,
    setSearch,
    setSelectedCategory,
    setSelectedStatus,
    setPage,
    setPageSize,
  };
}
