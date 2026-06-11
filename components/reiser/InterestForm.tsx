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
  /** Extra fields for harvest / package trips (nights + period). */
  extended?: boolean;
}

export function InterestForm({
  tripId,
  departureId,
  locale,
  extended = false,
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

    const preferredNightsRaw = formData.get("preferredNights");
    const preferredNights =
      preferredNightsRaw && String(preferredNightsRaw).length > 0
        ? Number(preferredNightsRaw)
        : undefined;

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
          preferredDates: formData.get("preferredPeriod") || undefined,
          preferredNights,
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

      {extended && (
        <>
          <div>
            <label
              htmlFor="preferredNights"
              className="mb-2 block text-sm font-medium text-primary"
            >
              {t("preferredNights")}
            </label>
            <select
              id="preferredNights"
              name="preferredNights"
              required
              className="w-full border border-primary/20 bg-white px-4 py-3 text-sm text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              defaultValue=""
            >
              <option value="" disabled>
                {t("selectNights")}
              </option>
              <option value="3">{t("nightsOption", { count: 3 })}</option>
              <option value="4">{t("nightsOption", { count: 4 })}</option>
              <option value="5">{t("nightsOption", { count: 5 })}</option>
            </select>
          </div>
          <Input
            label={t("preferredPeriod")}
            name="preferredPeriod"
            placeholder={t("preferredPeriodPlaceholder")}
            required
          />
        </>
      )}

      <Textarea
        label={extended ? t("optionalMessage") : contact("message")}
        name="message"
        required={!extended}
      />

      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="pt-2">
        <Button type="submit" variant="ghost" disabled={loading}>
          {loading ? common("loading") : t("expressInterest")}
        </Button>
      </div>
    </form>
  );
}
