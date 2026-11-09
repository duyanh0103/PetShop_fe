import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import useDebouncedValue from "./useDebouncedValue";

const DEFAULT_PAGE_SIZE = 10;

/**
 * List filters kept in the URL, so opening a detail page and coming back
 * restores them. `filterNames` are the plain filters besides page, limit and
 * search; changing any filter returns to page 1.
 */
export default function useListParams(filterNames) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const pageSize = Number(searchParams.get("limit")) || DEFAULT_PAGE_SIZE;
  const urlSearch = searchParams.get("search") ?? "";

  const update = (changes) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);

        Object.entries(changes).forEach(([key, value]) => {
          if (value === "" || value === undefined || value === null) next.delete(key);
          else next.set(key, String(value));
        });

        return next;
      },
      { replace: true }
    );
  };

  const [search, setSearch] = useState(urlSearch);
  const debouncedSearch = useDebouncedValue(search, 400);

  useEffect(() => {
    if (debouncedSearch !== (new URLSearchParams(window.location.search).get("search") ?? "")) {
      update({ search: debouncedSearch, page: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only reacts to typing
  }, [debouncedSearch]);

  const filters = Object.fromEntries(
    filterNames.map((name) => [name, searchParams.get(name) ?? ""])
  );

  const total = (pagination) => pagination?.total ?? 0;

  return {
    page,
    pageSize,
    search,
    setSearch,
    filters,
    // What to send to the API.
    query: { page, limit: pageSize, search: urlSearch, ...filters },
    setFilter: (name, value) => update({ [name]: value, page: "" }),
    hasFilters: Boolean(urlSearch) || Object.values(filters).some(Boolean),
    clearFilters: () => {
      setSearch("");
      update({ search: "", page: "", ...Object.fromEntries(filterNames.map((name) => [name, ""])) });
    },
    // Props for the shared Pagination bar.
    paginationProps: (pagination) => ({
      page,
      pageSize,
      totalPages: pagination?.totalPages ?? 1,
      totalItems: total(pagination),
      startItem: total(pagination) === 0 ? 0 : (page - 1) * pageSize + 1,
      endItem: Math.min(page * pageSize, total(pagination)),
      onPageChange: (next) => update({ page: next > 1 ? next : "" }),
      onPageSizeChange: (value) => update({ limit: Number(value), page: "" }),
    }),
  };
}
