"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { images } from "@/lib/image-registry";
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
        isFixed ? "fixed" : isOverlay ? "absolute" : "sticky",
        isOverlay
          ? "border-b border-transparent bg-transparent"
          : "border-b border-primary/10 bg-cream/95 backdrop-blur-sm"
      )}
    >
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:py-5">
        <Link
          href="/"
          className="shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Image
            src={images.logo.mark}
            alt="Smaken av Frankrike"
            width={1024}
            height={1024}
            className="h-20 w-auto md:h-24"
            priority
          />
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
