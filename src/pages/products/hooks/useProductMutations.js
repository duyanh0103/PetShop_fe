import { useCallback } from "react";

import productService from "../services/productService";

export default function useProductMutations({ setProducts, page, setPage, pageSize }) {
  const createProduct = useCallback(
    async (product) => {
      const normalizedProduct = {
        ...product,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const createdProduct = await productService.createProduct(normalizedProduct);
      const finalProduct = {
        ...createdProduct,
        id: createdProduct.id ?? normalizedProduct.id,
        createdAt: createdProduct.createdAt ?? normalizedProduct.createdAt,
        updatedAt: createdProduct.updatedAt ?? normalizedProduct.updatedAt,
      };

      if (typeof setProducts === "function") {
        setProducts((currentProducts) => [finalProduct, ...currentProducts]);
      }

      return finalProduct;
    },
    [setProducts]
  );

  const updateProduct = useCallback(
    async (product) => {
      const normalizedProduct = {
        ...product,
        updatedAt: new Date().toISOString(),
      };

      const updatedProduct = await productService.updateProduct(product.id, normalizedProduct);
      const finalProduct = {
        ...updatedProduct,
        id: updatedProduct?.id ?? product.id,
        createdAt: updatedProduct?.createdAt ?? product.createdAt,
        updatedAt: updatedProduct?.updatedAt ?? normalizedProduct.updatedAt,
      };

      if (typeof setProducts === "function") {
        setProducts((currentProducts) =>
          currentProducts.map((currentProduct) =>
            currentProduct.id === product.id ? finalProduct : currentProduct
          )
        );
      }

      return finalProduct;
    },
    [setProducts]
  );

  const deleteProduct = useCallback(
    async (id) => {
      const deletedId = await productService.deleteProduct(id);

      if (!deletedId) return null;

      if (typeof setProducts === "function") {
        setProducts((currentProducts) => currentProducts.filter((currentProduct) => currentProduct.id !== id));
      }

      // Pagination adjustments are handled by the `useProducts` hook which
      // recalculates total pages and clamps the current page when `products` changes.

      return deletedId;
    },
    [setProducts, setPage, page]
  );

  return {
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
