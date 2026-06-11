"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function NewsletterSignup() {
  const t = useTranslations("home.newsletter");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <Section className="border-t border-primary/10 bg-primary/5">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-3xl text-primary">{t("title")}</h2>
        <p className="mt-4 leading-relaxed text-text/75">{t("description")}</p>
        {submitted ? (
          <p className="mt-8 text-primary">{t("success")}</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <Input
                type="email"
                name="email"
                required
                placeholder={t("placeholder")}
                aria-label={t("placeholder")}
              />
            </div>
            <Button type="submit" variant="ghost" className="shrink-0">
              {t("submit")}
            </Button>
          </form>
        )}
      </div>
    </Section>
  );
}
