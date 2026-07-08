import * as React from "react";

export function Card({ title, children, className = "", ...props }) {
  return (
    <div className={`bg-white shadow rounded p-4 ${className}`.trim()} {...props}>
      {title && <h3 className="font-semibold mb-2">{title}</h3>}
      {children}
    </div>
  );
}
