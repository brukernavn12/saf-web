"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/locales";

const locales: { code: Locale; label: string }[] = [
  { code: "no", label: "NO" },
  { code: "en", label: "EN" },
];

interface LanguageSwitcherProps {
  isOverlay?: boolean;
}

export function LanguageSwitcher({ isOverlay = false }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 text-xs tracking-widest">
      {locales.map(({ code, label }, index) => (
        <span key={code} className="flex items-center gap-1">
          {index > 0 && (
            <span
              className={cn(isOverlay ? "text-cream/30" : "text-primary/20")}
            >
              |
            </span>
          )}
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale: code })}
            className={cn(
              locale === code
                ? "text-accent"
                : isOverlay
                  ? "text-cream/70 transition-colors hover:text-cream"
                  : "text-text/60 transition-colors hover:text-primary"
            )}
            aria-current={locale === code ? "true" : undefined}
          >
            {label}
          </button>
        </span>
      ))}
    </div>
  );
}
