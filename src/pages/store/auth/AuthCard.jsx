import { Input } from "@/components/ui/input";

export function AuthCard({ title, description, children, footer }) {
  return (
    <div className="mx-auto w-full max-w-sm py-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold">{title}</h1>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {children}
      </div>
      {footer ? <p className="mt-4 text-center text-sm text-muted-foreground">{footer}</p> : null}
    </div>
  );
}

// Label + input + inline error, wired to react-hook-form's register().
export function FormField({ id, label, error, registration, ...inputProps }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...inputProps}
        {...registration}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error.message}
        </p>
      ) : null}
    </div>
  );
}

export function ServerError({ message }) {
  if (!message) return null;

  return (
    <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {message}
    </p>
  );
}
