import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function QuantityPicker({ value, max, onChange }) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border">
      <Button
        variant="ghost"
        size="icon-lg"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Giảm số lượng"
      >
        <Minus />
      </Button>
      <span className="w-10 text-center text-sm font-medium" aria-live="polite">
        {value}
      </span>
      <Button
        variant="ghost"
        size="icon-lg"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Tăng số lượng"
      >
        <Plus />
      </Button>
    </div>
  );
}
