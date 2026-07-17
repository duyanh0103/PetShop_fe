import { useMemo, useState } from "react";

import { useToast } from "@/components/ui/toast";
import productExcelService from "../services/productExcelService";

export default function useProductImport({ products = [], onImportSuccess }) {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [previewRows, setPreviewRows] = useState([]);
  const [previewErrors, setPreviewErrors] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const resetPreview = () => {
    setPreviewRows([]);
    setPreviewErrors([]);
    setSelectedFile(null);
    setIsPreviewVisible(false);
  };

  const handleFileUpload = async (file) => {
    if (!file) {
      return;
    }

    try {
      setIsImporting(true);
      setSelectedFile(file);
      const parsedRows = await productExcelService.parseExcelFile(file);
      const { validRows, errors } = productExcelService.validateProducts(parsedRows, products);

      setPreviewRows(validRows);
      setPreviewErrors(errors);
      setIsPreviewVisible(true);
    } catch (error) {
      toast({
        title: "Import failed",
        description: error?.message || "Unable to parse the selected file.",
      });
      resetPreview();
    } finally {
      setIsImporting(false);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      return;
    }

    try {
      setIsImporting(true);
      const parsedRows = await productExcelService.parseExcelFile(selectedFile);
      const { validRows, errors } = productExcelService.validateProducts(parsedRows, products);

      if (errors.length > 0) {
        setPreviewRows(validRows);
        setPreviewErrors(errors);
        setIsPreviewVisible(true);
        toast({ title: "Import preview has errors", description: "Please fix the invalid rows before importing." });
        return;
      }

      if (typeof onImportSuccess === "function") {
        await onImportSuccess(validRows);
      }

      toast({ title: `${validRows.length} products imported successfully.` });
      resetPreview();
    } catch (error) {
      toast({ title: "Import failed", description: error?.message || "Unable to import the selected file." });
    } finally {
      setIsImporting(false);
    }
  };

  const previewSummary = useMemo(() => ({
    totalRows: previewRows.length + previewErrors.length,
    validRows: previewRows.length,
    invalidRows: previewErrors.length,
  }), [previewErrors.length, previewRows.length]);

  return {
    isImporting,
    previewRows,
    previewErrors,
    selectedFile,
    isPreviewVisible,
    previewSummary,
    resetPreview,
    handleFileUpload,
    handleImport,
  };
}
