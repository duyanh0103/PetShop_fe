import { useState } from "react";

import ProductToolbar from "./components/ProductToolbar";
import ProductTable from "./components/ProductTable";
import ProductPagination from "./components/ProductPagination";
import ProductDialog from "./components/ProductDialog";
import ProductDeleteDialog from "./components/ProductDeleteDialog";
import useProductDialog from "./hooks/useProductDialog";
import useProducts from "./hooks/useProducts";
import useProductMutations from "./hooks/useProductMutations";
import useCategoryOptions from "./hooks/useCategoryOptions";
import { useToast } from "@/components/ui/toast";

export default function Products() {
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const dialog = useProductDialog();
  const { open, mode, selectedProduct, openCreateDialog, openEditDialog, closeDialog } = dialog;
  const { toast } = useToast();

  const { categories } = useCategoryOptions();

  const productsQuery = useProducts();
  const {
    products,
    loading,
    error,
    search,
    selectedCategory,
    isActive,
    page,
    pageSize,
    totalPages,
    totalItems,
    startItem,
    endItem,
    setSearch,
    setSelectedCategory,
    setIsActive,
    setPage,
    setPageSize,
    refetch,
  } = productsQuery;

  const mutations = useProductMutations({ refetch });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState(null);

  const handleSubmitProduct = async (data) => {
    try {
      setSubmitting(true);

      const payload = {
        name: data.productName,
        sku: data.sku,
        categoryIds: data.categoryIds,
        price: data.price,
        quantity: data.quantity,
        description: data.description,
        imageUrl: data.imageUrl,
        isActive: data.isActive,
      };

      if (mode === "edit" && selectedProduct) {
        const updated = await mutations.updateProduct(selectedProduct.id, payload);
        toast({ title: "Cập nhật sản phẩm thành công.", description: updated.name });
      } else {
        const created = await mutations.createProduct(payload);
        toast({ title: "Tạo sản phẩm thành công.", description: created.name });
      }

      closeDialog();
    } catch (err) {
      toast({
        title: "Đã có lỗi xảy ra.",
        description: err.response?.data?.message ?? "Vui lòng thử lại.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      setTogglingId(product.id);
      await mutations.updateProductStatus(product.id, !product.isActive);
    } catch (err) {
      toast({
        title: "Không thể cập nhật trạng thái.",
        description: err.response?.data?.message ?? "Vui lòng thử lại.",
      });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <ProductToolbar
        search={search}
        category={selectedCategory}
        status={isActive}
        categories={categories}
        onSearchChange={(event) => setSearch(event.target.value)}
        onCategoryChange={setSelectedCategory}
        onStatusChange={setIsActive}
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
          categoryIds: selectedProduct.categoryIds ?? [selectedProduct.categoryId],
          price: selectedProduct.price,
          quantity: selectedProduct.quantity,
          description: selectedProduct.description ?? "",
          imageUrl: selectedProduct.imageUrl ?? "",
          isActive: selectedProduct.isActive,
        } : undefined}
        onSubmit={handleSubmitProduct}
        loading={submitting}
        products={products}
        categories={categories}
        mode={mode}
        submitLabel={mode === "edit" ? "Cập nhật sản phẩm" : "Lưu sản phẩm"}
      />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-border/60 bg-background/95 p-6 text-sm text-muted-foreground">
          Đang tải sản phẩm...
        </div>
      ) : (
        <>
          <ProductTable
            products={products}
            onEdit={openEditDialog}
            onDelete={(product) => {
              setSelectedToDelete(product);
              setDeleteDialogOpen(true);
            }}
            onToggleStatus={handleToggleStatus}
            togglingId={togglingId}
          />

          <ProductDeleteDialog
            open={deleteDialogOpen}
            onOpenChange={(nextOpen) => {
              setDeleteDialogOpen(nextOpen);
              if (!nextOpen) {
                setSelectedToDelete(null);
              }
            }}
            product={selectedToDelete}
            onConfirm={async (id) => {
              try {
                setSubmitting(true);
                const deleted = await mutations.deleteProduct(id);

                if (deleted) {
                  toast({ title: "Xóa sản phẩm thành công." });
                }
              } catch (err) {
                toast({
                  title: "Không thể xóa sản phẩm.",
                  description: err.response?.data?.message ?? "Vui lòng thử lại.",
                });
              } finally {
                setSubmitting(false);
                setDeleteDialogOpen(false);
                setSelectedToDelete(null);
              }
            }}
            loading={submitting}
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
