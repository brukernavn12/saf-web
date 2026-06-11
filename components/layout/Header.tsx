"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Nav } from "./Nav";
import { MobileNav } from "./MobileNav";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useHeaderOverlay } from "./useHeaderOverlay";

export function Header() {
  const { isOverlay, isFixed } = useHeaderOverlay();

  return (
    <header
      className={cn(
        "inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        isFixed ? "fixed" : "absolute",
        isOverlay
          ? "border-b border-transparent bg-transparent"
          : "border-b border-primary/10 bg-cream/95 backdrop-blur-sm"
      )}
    >
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className={cn(
            "font-serif text-2xl tracking-tight transition-colors duration-300",
            isOverlay ? "text-cream" : "text-primary"
          )}
        >
          Languedoc
        </Link>
        <div className="flex items-center gap-4 md:gap-8">
          <Nav isOverlay={isOverlay} />
          <LanguageSwitcher isOverlay={isOverlay} />
          <MobileNav isOverlay={isOverlay} />
        </div>
      </div>
    </header>
  );
}
