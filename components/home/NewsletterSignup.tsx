"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

export function NewsletterSignup() {
  const t = useTranslations("home.newsletter");
  const locale = useLocale() as Locale;
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const optIn = formData.get("optIn") === "on";

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, optIn, locale }),
      });

      if (!response.ok) {
        setError(t("error"));
        return;
      }

      setSubmitted(true);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="border-y border-primary/10 bg-cream-dark py-14 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-8 md:flex-row md:items-start md:justify-between md:gap-12 md:px-10 lg:px-12">
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
          <p className="font-serif text-lg text-primary md:max-w-md md:pt-8">
            {t("success")}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full md:max-w-md md:shrink-0 md:pt-1"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                disabled={loading}
                placeholder={t("placeholder")}
                aria-label={t("placeholder")}
                className={cn(
                  "w-full border border-primary/15 bg-cream px-4 py-3 text-text placeholder:text-text/40",
                  "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 sm:flex-1 sm:rounded-r-none",
                  "disabled:cursor-not-allowed disabled:opacity-60"
                )}
              />
              <Button
                type="submit"
                disabled={loading}
                className="shrink-0 rounded-none sm:rounded-l-none"
              >
                {loading ? t("submitting") : t("submit")}
              </Button>
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-3 text-left">
              <input
                type="checkbox"
                name="optIn"
                required
                disabled={loading}
                className="mt-1 h-4 w-4 shrink-0 accent-accent"
              />
              <span className="text-sm leading-relaxed text-text/70">
                {t("consent")}
              </span>
            </label>

            <p className="mt-2 text-xs leading-relaxed text-text/45">
              {t("unsubscribe")}
            </p>

            {error && (
              <p className="mt-4 text-sm text-red-800" role="alert">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
