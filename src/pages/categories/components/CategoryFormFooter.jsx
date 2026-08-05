import { Button } from "@/components/ui/button";

export default function CategoryFormFooter({
  onCancel,
  loading = false,
  submitLabel = "Save Category",
}) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-5 sm:flex-row sm:justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={loading}
        className="w-full sm:w-auto"
      >
        Cancel
      </Button>

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {submitLabel}
      </Button>
    </div>
  );
}
