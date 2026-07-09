import ProductToolbar from "./components/ProductToolbar";
import ProductTable from "./components/ProductTable";
import ProductPagination from "./components/ProductPagination";
import useProducts from "./hooks/useProducts";

export default function Products() {
  const {
    paginatedProducts,
    loading,
    search,
    selectedCategory,
    selectedStatus,
    page,
    pageSize,
    totalPages,
    setSearch,
    setSelectedCategory,
    setSelectedStatus,
    setPage,
  } = useProducts();

  const handleAddProduct = () => {
    // Placeholder for future add-product flow.
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
        onAddProduct={handleAddProduct}
      />

      {loading ? (
        <div className="rounded-xl border border-border/60 bg-background/95 p-6 text-sm text-muted-foreground">
          Loading products...
        </div>
      ) : (
        <>
          <ProductTable products={paginatedProducts} />
          <ProductPagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}