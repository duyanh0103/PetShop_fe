import { useCallback } from "react";

import productService from "../services/productService";

/**
 * Wraps productService CRUD calls and refetches the current list afterward.
 * We refetch rather than patch local state in place because the list is
 * server-paginated/sorted/filtered — splicing an item into the wrong page
 * locally would silently drift from what the backend would actually return.
 */
export default function useProductMutations({ refetch }) {
  const createProduct = useCallback(
    async (data) => {
      const created = await productService.createProduct(data);
      await refetch();
      return created;
    },
    [refetch]
  );

  const updateProduct = useCallback(
    async (id, data) => {
      const updated = await productService.updateProduct(id, data);
      await refetch();
      return updated;
    },
    [refetch]
  );

  const updateProductStatus = useCallback(
    async (id, isActive) => {
      const updated = await productService.updateProductStatus(id, isActive);
      await refetch();
      return updated;
    },
    [refetch]
  );

  const deleteProduct = useCallback(
    async (id) => {
      const deletedId = await productService.deleteProduct(id);
      await refetch();
      return deletedId;
    },
    [refetch]
  );

  return {
    createProduct,
    updateProduct,
    updateProductStatus,
    deleteProduct,
  };
}
