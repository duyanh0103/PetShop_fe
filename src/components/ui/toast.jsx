import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, X } from "lucide-react";

import { cn } from "@/lib/utils";

const ToastContext = createContext(null);

let toastId = 0;

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, duration = 2500 }) => {
      const id = ++toastId;

      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id,
          title,
          description,
        },
      ]);

      window.setTimeout(() => {
        dismiss(id);
      }, duration);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toasts, toast, dismiss }), [dismiss, toast, toasts]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}

function Toaster() {
  const { toasts, dismiss } = useToast();

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed right-4 top-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((toastItem) => (
        <div
          key={toastItem.id}
          className="rounded-xl border border-border/70 bg-background/95 p-4 shadow-lg backdrop-blur"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-emerald-100 p-1 text-emerald-600">
              <CheckCircle2 className="size-4" />
            </div>

            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold text-foreground">{toastItem.title}</p>
              {toastItem.description ? (
                <p className="text-sm text-muted-foreground">{toastItem.description}</p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => dismiss(toastItem.id)}
              className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Dismiss toast"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ))}
    </div>,
    document.body
  );
}

export { ToastProvider, Toaster, useToast };
export default ToastProvider;
