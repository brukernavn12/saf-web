import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Departure, Locale, Trip } from "@/types";
import {
  formatDepartureCardRange,
  formatTripListPrice,
  getLocalizedTripField,
  getTripCardPriceLabel,
  getTripImage,
  hasPackagePricing,
  showTripStandardPrice,
} from "@/lib/utils";

interface TripCardProps {
  trip: Trip;
  departures: Departure[];
  locale: Locale;
}

function getCardPriceLabel(
  trip: Trip,
  locale: Locale,
  t: ReturnType<typeof useTranslations<"trips">>
): string | null {
  if (hasPackagePricing(trip)) {
    return getTripCardPriceLabel(trip) ?? t("packagePricing");
  }
  if (showTripStandardPrice(trip)) {
    return t("fromPrice", { price: formatTripListPrice(trip, locale) });
  }
  return null;
}

export function TripCard({ trip, departures, locale }: TripCardProps) {
  const t = useTranslations("trips");
  const title = getLocalizedTripField(trip, "title", locale) ?? trip.title_no;
  const tagline = getLocalizedTripField(trip, "tagline", locale);
  const image = getTripImage(trip);
  const nearestDeparture = departures[0];
  const priceLabel = getCardPriceLabel(trip, locale, t);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <Link
        href={`/reiser/${trip.slug}`}
        className="flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <div className="relative h-[220px] shrink-0 overflow-hidden bg-primary/10">
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col px-5 py-5">
          <p className="text-[11px] uppercase tracking-[0.25em] text-text/45">
            {trip.category}
          </p>

          {trip.district && (
            <p className="mt-1 text-[11px] tracking-[0.12em] text-text/40">
              {trip.district}
            </p>
          )}

          <h3 className="mt-2 line-clamp-2 font-serif text-xl leading-snug text-primary">
            {title}
          </h3>

          {tagline && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text/55">
              {tagline}
            </p>
          )}

          {trip.duration_days != null && trip.duration_days > 0 && (
            <p className="mt-3 text-xs text-text/50">
              {t("days", { count: trip.duration_days })}
            </p>
          )}

          <div className="mt-auto pt-4">
            {priceLabel && (
              <p className="text-sm font-medium text-primary">{priceLabel}</p>
            )}

            {nearestDeparture ? (
              <p
                className={`text-sm font-medium text-primary/85 ${priceLabel ? "mt-1.5" : ""}`}
              >
                {formatDepartureCardRange(
                  nearestDeparture.start_date,
                  nearestDeparture.end_date,
                  locale
                )}
              </p>
            ) : (
              <p
                className={`text-sm tracking-wide text-accent ${priceLabel ? "mt-1.5" : ""}`}
              >
                {t("expressInterest")}
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
