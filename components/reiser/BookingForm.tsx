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
import { formatTripAmount } from "@/lib/utils";
import type { Departure, Locale, Trip } from "@/types";

interface BookingFormProps {
  tripId: string;
  trip: Pick<
    Trip,
    | "price_nok"
    | "base_price_eur"
    | "single_room_supplement_eur"
    | "min_persons_per_booking"
  >;
  departureId?: string;
  departures: Departure[];
  locale: Locale;
  eurToNokRate?: number | null;
}

export function BookingForm({
  tripId,
  trip,
  departureId,
  departures,
  locale,
  eurToNokRate = null,
}: BookingFormProps) {
  const t = useTranslations("tripDetail");
  const contact = useTranslations("contact");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [persons, setPersons] = useState(1);
  const [roomPreference, setRoomPreference] = useState<
    "share_with_named" | "open_to_share"
  >("open_to_share");
  const [eurToNokRateLive, setEurToNokRateLive] = useState<number | null>(null);

  useEffect(() => {
    if (eurToNokRate != null) {
      return;
    }

    fetch("/api/exchange-rate")
      .then((res) => res.json())
      .then((data: { rate: number | null }) => {
        setEurToNokRateLive(data.rate ?? null);
      })
      .catch(() => setEurToNokRateLive(null));
  }, [eurToNokRate]);

  const displayRate = eurToNokRate ?? eurToNokRateLive;

  const selectedDeparture = departures.find((d) => d.id === departureId);
  const minPersons = Math.max(
    MIN_BOOKING_PERSONS,
    trip.min_persons_per_booking ?? MIN_BOOKING_PERSONS
  );
  const pricePerPerson = selectedDeparture?.price_eur ?? trip.base_price_eur;
  const singleRoomSupplementEur = trip.single_room_supplement_eur;
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
    displayRate != null ? convertEurToNok(depositEur, displayRate) : null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!departureId) {
      setError(t("selectDeparture"));
      return;
    }

    if (persons < minPersons) {
      setError(t("minPersonsBooking", { count: minPersons }));
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const roomMateName = formData.get("roomMateName")?.toString().trim();

    if (roomPreference === "share_with_named" && !roomMateName) {
      setError(t("roomMateNameRequired"));
      return;
    }

    setLoading(true);
    setError(null);

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
          roomPreference,
          roomMateName:
            roomPreference === "share_with_named" ? roomMateName : undefined,
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

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-primary">
          {t("roomPreference")}
        </legend>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-text/80">
          <input
            type="radio"
            name="roomPreference"
            value="share_with_named"
            checked={roomPreference === "share_with_named"}
            onChange={() => setRoomPreference("share_with_named")}
            className="mt-1"
          />
          <span>{t("roomShareWithNamed")}</span>
        </label>
        {roomPreference === "share_with_named" && (
          <div className="ml-6">
            <Input label={t("roomMateName")} name="roomMateName" required />
          </div>
        )}
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-text/80">
          <input
            type="radio"
            name="roomPreference"
            value="open_to_share"
            checked={roomPreference === "open_to_share"}
            onChange={() => setRoomPreference("open_to_share")}
            className="mt-1"
          />
          <span>{t("roomOpenToShare")}</span>
        </label>
      </fieldset>

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
              amount: formatTripAmount(singleSupplementEur, trip, locale, displayRate),
            })}
          </p>
        )}

        <p className="font-medium text-primary">
          {t("depositForPersons", {
            count: persons,
            deposit: formatTripAmount(depositEur, trip, locale, displayRate),
            perPerson: formatTripAmount(depositPerPerson, trip, locale, displayRate),
          })}
        </p>
        <p className="font-medium text-primary">
          {t("totalTripPrice", {
            count: persons,
            total: formatTripAmount(totalEur, trip, locale, displayRate),
          })}
        </p>
        {locale === "en" && depositNok != null && (
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
