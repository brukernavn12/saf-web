"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function NewsletterSignup() {
  const t = useTranslations("home.newsletter");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="border-y border-primary/10 bg-cream-dark py-14 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-8 md:flex-row md:items-center md:justify-between md:gap-12 md:px-10 lg:px-12">
        <div className="md:max-w-md">
          <p className="text-[11px] uppercase tracking-[0.32em] text-accent">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 font-serif text-2xl leading-snug text-primary md:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text/60">
            {t("description")}
          </p>
        </div>

        {submitted ? (
          <p className="font-serif text-lg text-primary md:text-right">
            {t("success")}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full md:max-w-md md:shrink-0"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
              <input
                type="email"
                name="email"
                required
                placeholder={t("placeholder")}
                aria-label={t("placeholder")}
                className={cn(
                  "w-full border border-primary/15 bg-cream px-4 py-3 text-text placeholder:text-text/40",
                  "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 sm:flex-1 sm:rounded-r-none"
                )}
              />
              <Button
                type="submit"
                className="shrink-0 rounded-none sm:rounded-l-none"
              >
                {t("submit")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
