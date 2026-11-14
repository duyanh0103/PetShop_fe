import { useState } from "react";

import CategoryToolbar from "./components/CategoryToolbar";
import CategoryTable from "./components/CategoryTable";
import CategoryDialog from "./components/CategoryDialog";
import CategoryDeleteDialog from "./components/CategoryDeleteDialog";
import Pagination from "@/components/common/Pagination";
import useCategoryDialog from "./hooks/useCategoryDialog";
import useCategories from "./hooks/useCategories";
import useCategoryMutations from "./hooks/useCategoryMutations";
import { useToast } from "@/components/ui/toast";

export default function Categories() {
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const dialog = useCategoryDialog();
  const { open, mode, selectedCategory, openCreateDialog, openEditDialog, closeDialog } = dialog;
  const { toast } = useToast();

  const categoriesQuery = useCategories();
  const {
    categories,
    loading,
    error,
    search,
    isActive,
    page,
    pageSize,
    totalPages,
    totalItems,
    startItem,
    endItem,
    setSearch,
    setIsActive,
    setPage,
    setPageSize,
    refetch,
  } = categoriesQuery;

  const mutations = useCategoryMutations({ refetch });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const handleSubmitCategory = async (data) => {
    try {
      setSubmitting(true);

      if (mode === "edit" && selectedCategory) {
        const updated = await mutations.updateCategory(selectedCategory.id, data);
        toast({ title: "Cập nhật danh mục thành công.", description: updated.name });
      } else {
        const created = await mutations.createCategory(data);
        toast({ title: "Tạo danh mục thành công.", description: created.name });
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

  const handleToggleStatus = async (category) => {
    try {
      setTogglingId(category.id);
      await mutations.updateCategoryStatus(category.id, !category.isActive);
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
      <CategoryToolbar
        search={search}
        isActive={isActive}
        onSearchChange={(event) => setSearch(event.target.value)}
        onIsActiveChange={setIsActive}
        onAddCategory={openCreateDialog}
      />

      <CategoryDialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            openCreateDialog();
            return;
          }
          closeDialog();
        }}
        defaultValues={selectedCategory ? {
          name: selectedCategory.name,
          slug: selectedCategory.slug,
          description: selectedCategory.description ?? "",
          imageUrl: selectedCategory.imageUrl ?? "",
          sortOrder: selectedCategory.sortOrder ?? 0,
          type: selectedCategory.type ?? "CATEGORY",
          isActive: selectedCategory.isActive,
        } : undefined}
        onSubmit={handleSubmitCategory}
        loading={submitting}
        mode={mode}
        submitLabel={mode === "edit" ? "Cập nhật danh mục" : "Lưu danh mục"}
      />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-border/60 bg-background/95 p-6 text-sm text-muted-foreground">
          Đang tải danh mục...
        </div>
      ) : (
        <>
          <CategoryTable
            categories={categories}
            onEdit={openEditDialog}
            onDelete={(category) => {
              setDeleteError("");
              setSelectedToDelete(category);
              setDeleteDialogOpen(true);
            }}
            onToggleStatus={handleToggleStatus}
            togglingId={togglingId}
          />

          <CategoryDeleteDialog
            open={deleteDialogOpen}
            onOpenChange={(nextOpen) => {
              setDeleteDialogOpen(nextOpen);
              if (!nextOpen) {
                setSelectedToDelete(null);
                setDeleteError("");
              }
            }}
            category={selectedToDelete}
            errorMessage={deleteError}
            onConfirm={async (id) => {
              try {
                setSubmitting(true);
                await mutations.deleteCategory(id);
                toast({ title: "Xóa danh mục thành công." });
                setDeleteDialogOpen(false);
                setSelectedToDelete(null);
              } catch (err) {
                setDeleteError(
                  err.response?.data?.message ?? "Không thể xóa danh mục."
                );
              } finally {
                setSubmitting(false);
              }
            }}
            loading={submitting}
          />

          {totalItems > 0 && (
            <Pagination
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              totalItems={totalItems}
              startItem={startItem}
              endItem={endItem}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              itemLabel="danh mục"
            />
          )}
        </>
      )}
    </div>
  );
}
