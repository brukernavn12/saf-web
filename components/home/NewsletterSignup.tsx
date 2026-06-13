"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/home/SectionHeading";
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
    <Section className="border-t border-primary/10 bg-primary/[0.04] py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-2xl">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          centered
        />
        <p className="-mt-8 text-center text-base leading-[1.85] text-text/70 md:-mt-12 md:text-lg">
          {t("description")}
        </p>
        {submitted ? (
          <p className="mt-12 text-center font-serif text-xl text-primary">
            {t("success")}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-6"
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
            <Button type="submit" variant="ghost" className="shrink-0 px-8">
              {t("submit")}
            </Button>
          </form>
        )}
      </div>
    </Section>
  );
}
