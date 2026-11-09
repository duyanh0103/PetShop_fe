import { cn } from "@/lib/utils";

// Colour is never the only signal: every tone is shown with its text label.
const TONES = {
  pending: "bg-status-pending text-status-pending-foreground",
  confirmed: "bg-status-confirmed text-status-confirmed-foreground",
  shipping: "bg-status-shipping text-status-shipping-foreground",
  completed: "bg-status-completed text-status-completed-foreground",
  cancelled: "bg-status-cancelled text-status-cancelled-foreground",
  locked: "bg-status-locked text-status-locked-foreground",
  oos: "bg-status-oos text-status-oos-foreground",
};

/** Pill with a leading dot, e.g. order status, stock or account state. */
export default function StatusBadge({ tone = "cancelled", dot = true, className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] leading-none font-bold whitespace-nowrap",
        TONES[tone],
        className
      )}
    >
      {dot ? <span aria-hidden="true" className="size-[7px] rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}
