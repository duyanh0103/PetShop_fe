import { useState } from "react";

import ProductToolbar from "./components/ProductToolbar";
import ProductTable from "./components/ProductTable";
import ProductPagination from "./components/ProductPagination";
import ProductDialog from "./components/ProductDialog";
import useProductDialog from "./hooks/useProductDialog";
import useProducts from "./hooks/useProducts";
import useProductMutations from "./hooks/useProductMutations";
import { defaultProductFormValues } from "./hooks/useProductForm";
import { useToast } from "@/components/ui/toast";

export default function Products() {
  const [submitting, setSubmitting] = useState(false);
  const dialog = useProductDialog();
  const { open, mode, selectedProduct, openCreateDialog, openEditDialog, closeDialog } = dialog;
  const { toast } = useToast();
  const productsQuery = useProducts();
  const mutations = useProductMutations({
    products: productsQuery.products,
    setProducts: productsQuery.setProducts,
  });
  const {
    products,
    paginatedProducts,
    loading,
    search,
    selectedCategory,
    selectedStatus,
    page,
    pageSize,
    totalPages,
    totalItems,
    startItem,
    endItem,
    setSearch,
    setSelectedCategory,
    setSelectedStatus,
    setPage,
    setPageSize,
  } = productsQuery;

  const handleSubmitProduct = async (data) => {
    try {
      setSubmitting(true);

      if (mode === "edit" && selectedProduct) {
        const updatedProduct = await mutations.updateProduct({
          ...selectedProduct,
          ...data,
          id: selectedProduct.id,
          name: data.productName,
          image: data.imageFile ? URL.createObjectURL(data.imageFile) : selectedProduct.image,
          category: data.category,
          price: Number(data.price),
          stock: Number(data.stock),
          status: data.status,
          sku: data.sku,
        });

        toast({
          title: "Product updated successfully.",
          description: updatedProduct.name,
        });
      } else {
        const createdProduct = await mutations.createProduct({
          ...data,
          name: data.productName,
          image: data.imageFile ? URL.createObjectURL(data.imageFile) : "https://placehold.co/60x60",
          category: data.category,
          price: Number(data.price),
          stock: Number(data.stock),
          status: data.status,
          sku: data.sku,
        });

        toast({
          title: "Product created successfully.",
          description: createdProduct.name,
        });
      }

      closeDialog();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ProductToolbar
        search={search}
        category={selectedCategory}
        status={selectedStatus}
        onSearchChange={(event) => setSearch(event.target.value)}
        onCategoryChange={(value) => setSelectedCategory(value)}
        onStatusChange={(value) => setSelectedStatus(value)}
        onAddProduct={openCreateDialog}
      />

      <ProductDialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            openCreateDialog();
            return;
          }

          closeDialog();
        }}
        defaultValues={selectedProduct ? {
          id: selectedProduct.id,
          productName: selectedProduct.name,
          sku: selectedProduct.sku,
          category: selectedProduct.category,
          price: selectedProduct.price,
          stock: selectedProduct.stock,
          description: selectedProduct.description ?? "",
          status: selectedProduct.status,
          image: selectedProduct.image,
          imageFile: null,
        } : defaultProductFormValues}
        onSubmit={handleSubmitProduct}
        loading={submitting}
        products={products}
        mode={mode}
        submitLabel={mode === "edit" ? "Update Product" : "Save Product"}
      />

      {loading ? (
        <div className="rounded-xl border border-border/60 bg-background/95 p-6 text-sm text-muted-foreground">
          Loading products...
        </div>
      ) : (
        <>
          <ProductTable
            products={paginatedProducts}
            onEdit={openEditDialog}
            onDelete={() => {}}
          />

          {totalItems > 0 && (
            <ProductPagination
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              totalItems={totalItems}
              startItem={startItem}
              endItem={endItem}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </>
      )}
    </div>
  );
}
