"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <Section className="pt-32" narrow>
      <h1 className="font-serif text-4xl text-primary md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg text-text/70">{t("description")}</p>
      {submitted ? (
        <p className="mt-10 rounded border border-primary/10 bg-primary/5 p-6 text-primary">
          {t("success")}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <Input label={t("name")} name="name" required />
          <Input label={t("email")} name="email" type="email" required />
          <Input label={t("phone")} name="phone" type="tel" />
          <Textarea label={t("message")} name="message" required />
          <Button type="submit" variant="ghost">
            {t("submit")}
          </Button>
        </form>
      )}
    </Section>
  );
}
