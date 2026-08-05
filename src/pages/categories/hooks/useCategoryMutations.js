import { useCallback } from "react";

import categoryService from "../services/categoryService";

/**
 * Wraps categoryService CRUD calls and refetches the current list afterward.
 * We refetch rather than patch local state in place because the list is
 * server-paginated/sorted/filtered — splicing an item into the wrong page
 * locally would silently drift from what the backend would actually return.
 */
export default function useCategoryMutations({ refetch }) {
  const createCategory = useCallback(
    async (data) => {
      const created = await categoryService.createCategory(data);
      await refetch();
      return created;
    },
    [refetch]
  );

  const updateCategory = useCallback(
    async (id, data) => {
      const updated = await categoryService.updateCategory(id, data);
      await refetch();
      return updated;
    },
    [refetch]
  );

  const updateCategoryStatus = useCallback(
    async (id, isActive) => {
      const updated = await categoryService.updateCategoryStatus(id, isActive);
      await refetch();
      return updated;
    },
    [refetch]
  );

  const deleteCategory = useCallback(
    async (id) => {
      const deletedId = await categoryService.deleteCategory(id);
      await refetch();
      return deletedId;
    },
    [refetch]
  );

  return {
    createCategory,
    updateCategory,
    updateCategoryStatus,
    deleteCategory,
  };
}
