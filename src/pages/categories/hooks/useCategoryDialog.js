import { useCallback, useState } from "react";

export default function useCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const openCreateDialog = useCallback(() => {
    setMode("create");
    setSelectedCategory(null);
    setOpen(true);
  }, []);

  const openEditDialog = useCallback((category) => {
    setMode("edit");
    setSelectedCategory(category);
    setOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    setMode("create");
    setSelectedCategory(null);
  }, []);

  return {
    open,
    mode,
    selectedCategory,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    setOpen,
  };
}
