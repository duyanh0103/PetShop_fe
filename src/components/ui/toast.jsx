import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, X } from "lucide-react";

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
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 top-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
    >
      {toasts.map((toastItem) => (
        <div
          key={toastItem.id}
          className="rounded-2xl bg-[#13306e] px-4 py-3 text-white shadow-[0_12px_32px_rgba(19,48,110,0.25)] dark:bg-[#24406f]"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-highlight">
              <CheckCircle2 className="size-5" />
            </div>

            <div className="flex-1 space-y-1">
              <p className="font-bold">{toastItem.title}</p>
              {toastItem.description ? (
                <p className="text-sm text-white/80">{toastItem.description}</p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => dismiss(toastItem.id)}
              className="rounded-lg p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Đóng thông báo"
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
