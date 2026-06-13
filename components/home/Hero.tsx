"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button, ButtonLink } from "@/components/ui/Button";
import { images } from "@/lib/image-registry";

export function Hero() {
  const t = useTranslations("home.hero");

  function scrollToCategories() {
    document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Image
        src={images.hero}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/80">
          {t("eyebrow")}
        </p>
        <h1 className="font-serif text-5xl leading-tight text-white md:text-7xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
          {t("subtitle")}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button type="button" onClick={scrollToCategories}>
            {t("ctaTrips")}
          </Button>
          <ButtonLink href="/kontakt" variant="secondary">
            {t("ctaContact")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
