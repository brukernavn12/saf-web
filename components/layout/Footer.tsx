"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { navLinks } from "./nav-links";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="border-t border-primary/10 bg-primary text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <Link href="/" className="font-serif text-xl hover:text-cream/90">
            Smaken av Frankrike
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/75">
            {t("tagline")}
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-cream/80">
          {navLinks.map(({ href, key }) => (
            <Link key={href} href={href} className="hover:text-cream">
              {nav(key)}
            </Link>
          ))}
        </div>
        <div className="text-sm text-cream/60">
          <p>{t("copyright")}</p>
          <p className="mt-2">{t("rights")}</p>
        </div>
      </div>
    </footer>
  );
}
