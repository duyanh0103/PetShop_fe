import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

const stepClassName =
  "inline-flex items-center justify-center rounded-full text-primary transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-35";

/** Pill stepper; `size="sm"` is the compact one used on cart lines. */
export default function QuantityPicker({ value, max, onChange, size = "default" }) {
  const step = size === "sm" ? "size-10" : "size-12";

  return (
    <div className="inline-flex items-center rounded-full border-[1.5px] border-input bg-card">
      <button
        type="button"
        className={cn(stepClassName, step)}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Giảm số lượng"
      >
        <Minus className="size-[18px]" />
      </button>
      <span
        className={cn("text-center font-extrabold", size === "sm" ? "w-9" : "w-12 text-lg")}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        className={cn(stepClassName, step)}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Tăng số lượng"
      >
        <Plus className="size-[18px]" />
      </button>
    </div>
  );
}
