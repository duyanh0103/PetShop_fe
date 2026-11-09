import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AuthCard({ title, description, children, footer, wide = false }) {
  return (
    <div className={cn("mx-auto w-full", wide ? "max-w-[520px]" : "max-w-[440px]")}>
      <div className="flex flex-col gap-4 rounded-[28px] bg-card p-6 sm:p-7">
        <div>
          <h1 className="text-[32px]">{title}</h1>
          {description ? <p className="mt-1 text-muted-foreground">{description}</p> : null}
        </div>
        {children}
        {footer ? <p className="text-center">{footer}</p> : null}
      </div>
    </div>
  );
}

const fieldClassName =
  "h-12 rounded-[14px] aria-invalid:bg-[#fff8f8] aria-invalid:ring-0 dark:aria-invalid:bg-danger-soft";

// Label + input + inline error, wired to react-hook-form's register().
// `hint` sits next to the label, e.g. "(không bắt buộc)"; `multiline` renders a textarea.
export function FormField({ id, label, hint, error, registration, multiline = false, className, ...inputProps }) {
  const shared = {
    id,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
    ...inputProps,
    ...registration,
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold">
        {label}
        {hint ? <span className="font-semibold text-muted-foreground"> {hint}</span> : null}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          className="w-full rounded-[14px] border-[1.5px] border-input bg-card px-3.5 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:bg-[#fff8f8] md:text-[15px] dark:aria-invalid:bg-danger-soft"
          {...shared}
        />
      ) : (
        <Input className={fieldClassName} {...shared} />
      )}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] font-bold text-danger-text">
          {error.message}
        </p>
      ) : null}
    </div>
  );
}

export function ServerError({ message }) {
  if (!message) return null;

  return (
    <p role="alert" className="rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm font-bold text-danger-text">
      {message}
    </p>
  );
}
