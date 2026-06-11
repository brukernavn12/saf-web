"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  calculateBookingAmountsEur,
  convertEurToNok,
  MIN_BOOKING_PERSONS,
} from "@/lib/payment";
import { formatPrice } from "@/lib/utils";
import type { Departure, Locale } from "@/types";

interface BookingFormProps {
  tripId: string;
  departureId?: string;
  departures: Departure[];
  pricePerPersonEur: number;
  singleRoomSupplementEur: number | null;
  locale: Locale;
}

export function BookingForm({
  tripId,
  departureId,
  departures,
  pricePerPersonEur,
  singleRoomSupplementEur,
  locale,
}: BookingFormProps) {
  const t = useTranslations("tripDetail");
  const contact = useTranslations("contact");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [persons, setPersons] = useState(MIN_BOOKING_PERSONS);
  const [eurToNokRate, setEurToNokRate] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/exchange-rate")
      .then((res) => res.json())
      .then((data: { rate: number | null }) => {
        setEurToNokRate(data.rate ?? null);
      })
      .catch(() => setEurToNokRate(null));
  }, []);

  const selectedDeparture = departures.find((d) => d.id === departureId);
  const minPersons = Math.max(
    MIN_BOOKING_PERSONS,
    selectedDeparture?.min_persons ?? MIN_BOOKING_PERSONS
  );
  const pricePerPerson = selectedDeparture?.price_eur ?? pricePerPersonEur;
  const {
    totalEur,
    depositEur,
    doubleRooms,
    singleRooms,
    singleSupplementEur,
    includesSingleSupplement,
  } = calculateBookingAmountsEur(
    pricePerPerson,
    persons,
    singleRoomSupplementEur
  );
  const depositPerPerson = Math.round(depositEur / persons);
  const depositNok =
    eurToNokRate != null ? convertEurToNok(depositEur, eurToNokRate) : null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!departureId) {
      setError(t("selectDeparture"));
      return;
    }

    if (persons < minPersons) {
      setError(t("minPersons", { count: minPersons }));
      return;
    }

    setLoading(true);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId,
          departureId,
          guestName: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          persons,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? t("paymentError"));
        setLoading(false);
        return;
      }

      window.location.href = data.redirectUrl;
    } catch {
      setError(t("paymentError"));
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input label={contact("name")} name="name" required />
      <Input label={contact("email")} name="email" type="email" required />
      <Input label={contact("phone")} name="phone" type="tel" required />
      <Input
        label={t("persons")}
        name="persons"
        type="number"
        min={minPersons}
        max={selectedDeparture?.available_spots ?? 12}
        value={persons}
        onChange={(e) =>
          setPersons(Math.max(minPersons, Number(e.target.value)))
        }
        required
      />

      <div className="space-y-3 border border-primary/10 bg-primary/5 p-4 text-sm">
        <p className="text-text/70">{t("depositInfo")}</p>

        <p className="font-medium text-primary">
          {singleRooms > 0
            ? t("roomAllocationWithSingle", { count: doubleRooms })
            : t("roomAllocation", { count: doubleRooms })}
        </p>

        {includesSingleSupplement && (
          <p className="text-text/70">
            {t("includesSingleSupplement", {
              amount: formatPrice(singleSupplementEur, locale),
            })}
          </p>
        )}

        <p className="font-medium text-primary">
          {t("depositForPersons", {
            count: persons,
            deposit: formatPrice(depositEur, locale),
            perPerson: formatPrice(depositPerPerson, locale),
          })}
        </p>
        <p className="font-medium text-primary">
          {t("totalTripPrice", {
            count: persons,
            total: formatPrice(totalEur, locale),
          })}
        </p>
        {depositNok != null && (
          <p className="text-text/60">
            {t("approxNok", {
              amount: depositNok.toLocaleString(
                locale === "en" ? "en-GB" : `${locale}-NO`
              ),
            })}
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" variant="ghost" disabled={loading || !departureId}>
        {loading ? t("redirecting") : t("secureSpot")}
      </Button>
    </form>
  );
}
