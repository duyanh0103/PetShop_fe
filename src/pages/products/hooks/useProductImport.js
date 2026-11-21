import { useState } from "react";

import { useToast } from "@/components/ui/toast";
import productExcelService from "../services/productExcelService";
import productService from "../services/productService";

const EMPTY_PREVIEW = { fileName: "", validRows: [], errors: [] };

export default function useProductImport({ categories = [], onImported }) {
  const { toast } = useToast();
  const [preview, setPreview] = useState(EMPTY_PREVIEW);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const reset = () => {
    setPreview(EMPTY_PREVIEW);
    setProgress(0);
    setResult(null);
  };

  const handleFile = async (file) => {
    if (!file) return;
    reset();
    try {
      setBusy(true);
      const rows = await productExcelService.parseExcelFile(file);
      setPreview({ fileName: file.name, ...productExcelService.validateRows(rows, categories) });
    } catch (error) {
      toast({ title: "Không đọc được file Excel.", description: error?.message ?? "Vui lòng dùng file mẫu." });
    } finally {
      setBusy(false);
    }
  };

  // One request per row so each failure (e.g. SKU already in the DB) is reported against its own row.
  const handleImport = async () => {
    const failures = [];
    let created = 0;
    setBusy(true);
    for (const [index, row] of preview.validRows.entries()) {
      try {
        await productService.createProduct(row.payload);
        created += 1;
      } catch (error) {
        failures.push({ row: row.rowNumber, message: error.response?.data?.message ?? "Lỗi không xác định." });
      }
      setProgress(index + 1);
    }
    setBusy(false);
    setResult({ created, failures });
    if (created > 0) await onImported?.();
  };

  return { preview, busy, progress, result, reset, handleFile, handleImport };
}
