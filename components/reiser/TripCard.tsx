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
import { getTripSeasonBlockKeys } from "@/lib/trip-season-blocks";

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
  const tDetail = useTranslations("tripDetail");
  const image = getTripImage(trip);
  const seasonBlockKeys = getTripSeasonBlockKeys(trip.slug);
  const cardDateLabel =
    seasonBlockKeys.length > 0
      ? seasonBlockKeys
          .map((key) =>
            tDetail(`seasonBlock.${trip.slug}.${key}.period`)
          )
          .join(" · ")
      : departures.length > 0
        ? departures
            .map((departure) =>
              formatDepartureCardRange(
                departure.start_date,
                departure.end_date,
                locale
              )
            )
            .join(" · ")
        : null;

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

          {cardDateLabel ? (
            <p className="mt-4 font-serif text-xl text-primary md:mt-5 md:text-2xl">
              {cardDateLabel}
            </p>
          ) : (
            <p className="mt-4 text-sm font-medium text-accent md:mt-5">
              {t("expressInterest")}
            </p>
          )}

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
          </div>
        </div>
      </Link>
    </article>
  );
}
