import { useCallback, useState } from "react";

export default function useProductDialog() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openCreateDialog = useCallback(() => {
    setMode("create");
    setSelectedProduct(null);
    setOpen(true);
  }, []);

  const openEditDialog = useCallback((product) => {
    setMode("edit");
    setSelectedProduct(product);
    setOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    setMode("create");
    setSelectedProduct(null);
  }, []);

  return {
    open,
    mode,
    selectedProduct,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    setOpen,
  };
}
