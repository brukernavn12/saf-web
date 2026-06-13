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
  eurToNokRate?: number | null;
}

export function TripBookingSection({
  trip,
  departures,
  locale,
  eurToNokRate = null,
}: TripBookingSectionProps) {
  const t = useTranslations("tripDetail");
  const formRef = useRef<HTMLDivElement>(null);
  const [activeDepartureId, setActiveDepartureId] = useState<string>();
  const [activeForm, setActiveForm] = useState<DepartureFormType | null>(null);

  function showForm(departureId: string, form: DepartureFormType) {
    setActiveDepartureId(departureId);
    setActiveForm(form);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (trip.interest_only || departures.length === 0) {
    return (
      <section
        ref={formRef}
        id="booking"
        className="mt-14 max-w-3xl scroll-mt-32"
      >
        <div className="bg-cream-dark px-8 py-10 md:px-10 md:py-12">
          <h2 className="font-serif text-2xl text-primary md:text-3xl">
            {t("expressInterest")}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text/65">
            {t("interestOnlyHint")}
          </p>
          <div className="mt-8 border-t border-primary/10 pt-8">
            <InterestForm
              tripId={trip.id}
              locale={locale}
              extended={Boolean(trip.price_info)}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="mt-14 max-w-3xl scroll-mt-32 space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-primary md:text-3xl">
          {t("tripDates")}
        </h2>
        <div className="mt-6">
          <DepartureList
          trip={trip}
          departures={departures}
          locale={locale}
          eurToNokRate={eurToNokRate}
          activeDepartureId={activeDepartureId}
          activeForm={activeForm}
          hideTitle
          onShowBooking={(id) => showForm(id, "booking")}
          onShowInterest={(id) => showForm(id, "interest")}
        />
        </div>
      </div>

      {activeForm && activeDepartureId && (
        <div
          ref={formRef}
          id="departure-form"
          className="scroll-mt-32 bg-cream-dark px-8 py-10 md:px-10 md:py-12"
        >
          <h2 className="font-serif text-2xl text-primary md:text-[1.75rem]">
            {activeForm === "booking" ? t("secureSpot") : t("expressInterest")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text/65">
            {activeForm === "booking" ? t("bookingHint") : t("interestHint")}
          </p>
          <div className="mt-8 border-t border-primary/10 pt-8">
            {activeForm === "booking" ? (
              <BookingForm
                tripId={trip.id}
                trip={trip}
                departureId={activeDepartureId}
                departures={departures}
                locale={locale}
                eurToNokRate={eurToNokRate}
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
    </section>
  );
}
