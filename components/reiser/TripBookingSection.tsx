"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Departure, Locale, Trip } from "@/types";
import {
  DepartureList,
  type DepartureFormType,
} from "@/components/reiser/DepartureList";
import { BookingForm } from "@/components/reiser/BookingForm";
import { InterestForm } from "@/components/reiser/InterestForm";

interface TripBookingSectionProps {
  trip: Trip;
  departures: Departure[];
  locale: Locale;
}

export function TripBookingSection({
  trip,
  departures,
  locale,
}: TripBookingSectionProps) {
  const t = useTranslations("tripDetail");
  const [activeDepartureId, setActiveDepartureId] = useState<string>();
  const [activeForm, setActiveForm] = useState<DepartureFormType | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  function showForm(departureId: string, form: DepartureFormType) {
    setActiveDepartureId(departureId);
    setActiveForm(form);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div className="space-y-8">
      <DepartureList
        departures={departures}
        locale={locale}
        activeDepartureId={activeDepartureId}
        activeForm={activeForm}
        onShowBooking={(id) => showForm(id, "booking")}
        onShowInterest={(id) => showForm(id, "interest")}
      />

      {activeForm && activeDepartureId && (
        <div
          ref={formRef}
          id="departure-form"
          className="scroll-mt-32 border border-primary/10 bg-white p-6"
        >
          <h2 className="font-serif text-2xl text-primary">
            {activeForm === "booking" ? t("secureSpot") : t("expressInterest")}
          </h2>
          <p className="mt-2 text-sm text-text/70">
            {activeForm === "booking" ? t("bookingHint") : t("interestHint")}
          </p>
          <div className="mt-6">
            {activeForm === "booking" ? (
              <BookingForm
                tripId={trip.id}
                departureId={activeDepartureId}
                departures={departures}
                pricePerPersonEur={trip.base_price_eur}
                singleRoomSupplementEur={trip.single_room_supplement_eur}
                locale={locale}
              />
            ) : (
              <InterestForm
                tripId={trip.id}
                departureId={activeDepartureId}
                locale={locale}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
