import { Link } from "react-router-dom";

import logoSmall from "@/assets/brand/logo-128.webp";
import { cn } from "@/lib/utils";

export const BRAND_NAME = "Cục Meow";
export const BRAND_TAGLINE = "Tìm đồng minh cùng gu Pate";
export const HOTLINE = "070.77.68.395";
export const HOTLINE_TEL = "tel:0707768395";

/** Logo + wordmark; `compact` hides the wordmark (collapsed sidebar). */
export default function BrandLogo({ to = "/", size = 48, compact = false, className, textClassName }) {
  return (
    <Link to={to} className={cn("flex shrink-0 items-center gap-2 no-underline", className)}>
      <img src={logoSmall} alt={compact ? BRAND_NAME : ""} width={size} height={size} className="object-contain" />
      {compact ? null : (
        <span className={cn("font-heading text-[26px] leading-none font-extrabold text-brand", textClassName)}>
          {BRAND_NAME}
        </span>
      )}
    </Link>
  );
}
