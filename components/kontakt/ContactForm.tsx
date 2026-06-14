"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const t = useTranslations("contact");
  const common = useTranslations("common");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? common("error"));
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError(common("error"));
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <p className="rounded border border-primary/10 bg-primary/5 p-6 text-primary">
        {t("success")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input label={t("name")} name="name" required />
      <Input label={t("email")} name="email" type="email" required />
      <Input label={t("phone")} name="phone" type="tel" />
      <Textarea label={t("message")} name="message" required />
      {error && (
        <p className="text-sm text-accent" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" variant="ghost" disabled={loading}>
        {loading ? common("loading") : t("submit")}
      </Button>
    </form>
  );
}
