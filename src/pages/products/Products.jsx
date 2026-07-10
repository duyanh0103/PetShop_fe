import ProductToolbar from "./components/ProductToolbar";
import ProductTable from "./components/ProductTable";
import ProductPagination from "./components/ProductPagination";
import ProductDialog from "./components/ProductDialog";
import useProductDialog from "./hooks/useProductDialog";
import useProducts from "./hooks/useProducts";
import { defaultProductFormValues } from "./hooks/useProductForm";

export default function Products() {
  const { open, openDialog, closeDialog } = useProductDialog();
  const {
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
  } = useProducts();

  const handleSubmitProduct = async (data) => {
    console.log(data);
    closeDialog();
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
        onAddProduct={openDialog}
      />

      <ProductDialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            openDialog();
            return;
          }

          closeDialog();
        }}
        defaultValues={defaultProductFormValues}
        onSubmit={handleSubmitProduct}
        loading={false}
      />

      {loading ? (
        <div className="rounded-xl border border-border/60 bg-background/95 p-6 text-sm text-muted-foreground">
          Loading products...
        </div>
      ) : (
        <>
          <ProductTable products={paginatedProducts} />

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
