"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

interface LogoProps {
  /** Width classes for the wrapper. Height follows automatically — the logo is never stretched. */
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * The real DEOLIKAR logo (public/brand/deolikar-logo.jpeg), untouched. It ships on
 * its own navy tile, so it is rendered as a rounded tile rather than recoloured.
 * To swap the logo, replace that file — no component changes needed.
 */
export function Logo({ className = "w-36", priority = false, sizes = "(min-width: 1024px) 200px, 160px" }: LogoProps) {
  const { t } = useLanguage();
  return (
    <span className={`block shrink-0 ${className}`}>
      <Image
        src="/brand/deolikar-logo.jpeg"
        alt={t.a11y.logoAlt}
        width={1275}
        height={437}
        priority={priority}
        sizes={sizes}
        quality={92}
        className="block h-auto w-full rounded-[10px] shadow-[0_8px_22px_-10px_rgba(1,20,52,0.55)] ring-1 ring-navy-950/10"
      />
    </span>
  );
}
