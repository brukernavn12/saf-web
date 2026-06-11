import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Departure, Locale, Trip } from "@/types";
import {
  formatDepartureRange,
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
  const hasDepartures = departures.length > 0;
  const priceLabel = getCardPriceLabel(trip, locale, t);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl">
      <Link
        href={`/reiser/${trip.slug}`}
        className="flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <div className="relative min-h-0 flex-[0.55] overflow-hidden bg-primary/10">
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

        <div className="flex min-h-0 flex-[0.45] flex-col px-5 py-4">
          <div className="flex items-baseline gap-2">
            <p className="text-[11px] uppercase tracking-[0.25em] text-text/45">
              {trip.category}
            </p>
            {trip.district && (
              <p className="text-[11px] text-text/35">· {trip.district}</p>
            )}
          </div>

          <h3 className="mt-1.5 line-clamp-2 font-serif text-xl leading-snug text-primary">
            {title}
          </h3>

          {tagline && (
            <p className="mt-1.5 line-clamp-1 text-sm leading-relaxed text-text/55">
              {tagline}
            </p>
          )}

          <div className="mt-auto pt-3">
            {trip.duration_days && (
              <p className="text-xs text-text/50">
                {t("days", { count: trip.duration_days })}
              </p>
            )}

            {priceLabel && (
              <p className="mt-1 text-sm font-medium text-primary">
                {priceLabel}
              </p>
            )}

            {hasDepartures ? (
              <ul className="mt-2.5 space-y-0.5">
                {departures.map((departure) => (
                  <li
                    key={departure.id}
                    className="text-xs font-medium text-primary/80"
                  >
                    {formatDepartureRange(
                      departure.start_date,
                      departure.end_date,
                      locale
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2.5 text-xs tracking-wide text-accent">
                {t("expressInterest")}
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
