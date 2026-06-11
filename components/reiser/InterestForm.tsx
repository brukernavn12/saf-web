"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/types";

interface InterestFormProps {
  tripId: string;
  departureId?: string;
  locale: Locale;
}

export function InterestForm({
  tripId,
  departureId,
  locale,
}: InterestFormProps) {
  const t = useTranslations("tripDetail");
  const contact = useTranslations("contact");
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
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId,
          departureId: departureId || undefined,
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
          locale,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
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
        {t("interestSuccess")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input label={contact("name")} name="name" required />
      <Input label={contact("email")} name="email" type="email" required />
      <Input label={contact("phone")} name="phone" type="tel" />
      <Textarea label={contact("message")} name="message" />
      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <div className="pt-2">
        <Button type="submit" variant="ghost" disabled={loading}>
          {loading ? common("loading") : contact("submit")}
        </Button>
      </div>
    </form>
  );
}
