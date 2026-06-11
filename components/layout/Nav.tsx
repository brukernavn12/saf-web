"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { navLinks } from "./nav-links";

interface NavProps {
  isOverlay: boolean;
}

export function Nav({ isOverlay }: NavProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-8 md:flex">
      {navLinks.map(({ href, key }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "text-sm tracking-wide transition-colors duration-300",
            pathname === href || pathname.startsWith(`${href}/`)
              ? "text-accent"
              : isOverlay
                ? "text-cream/90 hover:text-cream"
                : "text-text/70 hover:text-primary"
          )}
        >
          {t(key)}
        </Link>
      ))}
    </nav>
  );
}
