"use client";

import { useTranslations } from "next-intl";
import type { Departure, Locale } from "@/types";
import { formatDate, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export type DepartureFormType = "booking" | "interest";

interface DepartureListProps {
  departures: Departure[];
  locale: Locale;
  activeDepartureId?: string;
  activeForm: DepartureFormType | null;
  onShowBooking: (departureId: string) => void;
  onShowInterest: (departureId: string) => void;
}

export function DepartureList({
  departures,
  locale,
  activeDepartureId,
  activeForm,
  onShowBooking,
  onShowInterest,
}: DepartureListProps) {
  const t = useTranslations("tripDetail");

  if (departures.length === 0) {
    return (
      <p className="border border-primary/10 bg-white p-6 text-text/70">
        {t("noDepartures")}
      </p>
    );
  }

  return (
    <div>
      <h3 className="font-serif text-2xl text-primary">{t("departures")}</h3>
      <ul className="mt-6 divide-y divide-primary/10 border border-primary/10">
        {departures.map((departure) => {
          const isActive = activeDepartureId === departure.id;
          const price = departure.price_eur;

          return (
            <li
              key={departure.id}
              className={`flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between ${
                isActive ? "bg-primary/5" : "bg-white"
              }`}
            >
              <div>
                <p className="font-medium text-primary">
                  {formatDate(departure.start_date, locale)} –{" "}
                  {formatDate(departure.end_date, locale)}
                </p>
                <p className="mt-1 text-sm text-text/60">
                  {t("minPersons", { count: departure.min_persons })}
                  {departure.guide_name &&
                    ` · ${t("guide")}: ${departure.guide_name}`}
                </p>
                {departure.notes && (
                  <p className="mt-1 text-sm text-text/60">{departure.notes}</p>
                )}
              </div>
              <div className="flex flex-col items-start gap-3 sm:items-end">
                {price != null && (
                  <p className="font-medium text-primary">
                    {formatPrice(price, locale)}
                  </p>
                )}
                <p className="text-sm text-accent">
                  {t("spotsLeft", { count: departure.available_spots })}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={
                      isActive && activeForm === "booking" ? "primary" : "ghost"
                    }
                    className="text-xs"
                    onClick={() => onShowBooking(departure.id)}
                  >
                    {t("secureSpot")}
                  </Button>
                  <Button
                    type="button"
                    variant={
                      isActive && activeForm === "interest" ? "primary" : "ghost"
                    }
                    className="text-xs"
                    onClick={() => onShowInterest(departure.id)}
                  >
                    {t("expressInterest")}
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
