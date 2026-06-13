"use client";

import { useTranslations } from "next-intl";
import type { Departure, Locale, Trip } from "@/types";
import { cn, formatDate, formatDeparturePrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export type DepartureFormType = "booking" | "interest";

interface DepartureListProps {
  trip: Trip;
  departures: Departure[];
  locale: Locale;
  eurToNokRate?: number | null;
  activeDepartureId?: string;
  activeForm: DepartureFormType | null;
  onShowBooking: (departureId: string) => void;
  onShowInterest: (departureId: string) => void;
  hideTitle?: boolean;
}

export function DepartureList({
  trip,
  departures,
  locale,
  eurToNokRate = null,
  activeDepartureId,
  activeForm,
  onShowBooking,
  onShowInterest,
  hideTitle = false,
}: DepartureListProps) {
  const t = useTranslations("tripDetail");

  if (departures.length === 0) {
    return (
      <p className="bg-cream-dark px-8 py-10 text-sm leading-relaxed text-text/70">
        {t("noDepartures")}
      </p>
    );
  }

  return (
    <div>
      {!hideTitle && (
        <h3 className="font-serif text-xl text-primary">{t("departures")}</h3>
      )}
      <ul className={cn("space-y-4", !hideTitle && "mt-6")}>
        {departures.map((departure) => {
          const isActive = activeDepartureId === departure.id;
          const price = formatDeparturePrice(
            trip,
            departure.price_eur ?? trip.base_price_eur,
            locale,
            eurToNokRate
          );

          return (
            <li
              key={departure.id}
              className={cn(
                "bg-cream-dark px-8 py-8 transition-colors md:px-10 md:py-9",
                isActive && "ring-1 ring-primary/15"
              )}
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-xl leading-snug text-primary md:text-2xl">
                    {formatDate(departure.start_date, locale, {
                      day: "numeric",
                      month: "long",
                    })}{" "}
                    –{" "}
                    {formatDate(departure.end_date, locale, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  {(departure.guide_name || departure.notes) && (
                    <div className="mt-3 space-y-1 text-sm leading-relaxed text-text/60">
                      {departure.guide_name && (
                        <p>
                          {t("guide")}: {departure.guide_name}
                        </p>
                      )}
                      {departure.notes && <p>{departure.notes}</p>}
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 flex-col gap-5 lg:items-end lg:text-right">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 lg:justify-end">
                    {price != null && (
                      <p className="font-medium text-primary">{price}</p>
                    )}
                    <p className="text-sm text-text/50">
                      {t("spotsLeft", { count: departure.available_spots })}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      variant={
                        isActive && activeForm === "booking" ? "primary" : "ghost"
                      }
                      className="px-5 py-2.5 text-xs"
                      onClick={() => onShowBooking(departure.id)}
                    >
                      {t("secureSpot")}
                    </Button>
                    <Button
                      type="button"
                      variant={
                        isActive && activeForm === "interest" ? "primary" : "ghost"
                      }
                      className="px-5 py-2.5 text-xs"
                      onClick={() => onShowInterest(departure.id)}
                    >
                      {t("expressInterest")}
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
