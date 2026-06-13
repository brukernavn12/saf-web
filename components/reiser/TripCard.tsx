"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Departure, Locale, Trip } from "@/types";
import { cn } from "@/lib/utils";
import {
  formatDepartureCardRange,
  getTripImage,
} from "@/lib/utils";

interface TripCardProps {
  trip: Trip;
  departures: Departure[];
  locale: Locale;
  title: string;
  tagline: string | null;
  priceLabel?: string | null;
  reverse?: boolean;
}

export function TripCard({
  trip,
  departures,
  locale,
  title,
  tagline,
  priceLabel = null,
  reverse = false,
}: TripCardProps) {
  const t = useTranslations("trips");
  const image = getTripImage(trip);
  const nearestDeparture = departures[0];

  return (
    <article className="group">
      <Link
        href={`/reiser/${trip.slug}`}
        className={cn(
          "grid overflow-hidden bg-cream-dark md:grid-cols-2",
          reverse && "md:[&>*:first-child]:order-2"
        )}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-primary/10 md:aspect-auto md:min-h-[340px]">
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>

        <div className="flex flex-col justify-center px-10 py-14 md:px-14 md:py-16 lg:px-16 lg:py-20">
          {trip.district && (
            <p className="text-[11px] uppercase tracking-[0.32em] text-accent">
              {trip.district}
            </p>
          )}

          <h3 className="mt-6 font-serif text-2xl leading-[1.06] text-primary md:mt-8 md:text-3xl lg:text-[2rem]">
            {title}
          </h3>

          {tagline && (
            <p className="mt-6 max-w-md text-base leading-[1.8] text-text/60 md:mt-8">
              {tagline}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text/55 md:mt-10">
            {trip.duration_days != null && trip.duration_days > 0 && (
              <span>{t("days", { count: trip.duration_days })}</span>
            )}
            {priceLabel && (
              <span className="font-medium text-primary">{priceLabel}</span>
            )}
            {nearestDeparture ? (
              <span>
                {formatDepartureCardRange(
                  nearestDeparture.start_date,
                  nearestDeparture.end_date,
                  locale
                )}
              </span>
            ) : (
              <span className="text-accent">{t("expressInterest")}</span>
            )}
          </div>

          <span className="mt-10 text-[11px] uppercase tracking-[0.32em] text-accent transition-colors group-hover:text-primary md:mt-12">
            {t("viewTrip")} →
          </span>
        </div>
      </Link>
    </article>
  );
}
