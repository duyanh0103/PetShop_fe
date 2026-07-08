import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductActions() {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="icon-sm">
        <Pencil className="size-4" />
      </Button>

      <Button variant="destructive" size="icon-sm">
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}