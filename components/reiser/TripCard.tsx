import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale, Trip } from "@/types";
import {
  formatTripListPrice,
  getLocalizedTripField,
  getTripCardPriceLabel,
  getTripImage,
  hasPackagePricing,
} from "@/lib/utils";

interface TripCardProps {
  trip: Trip;
  locale: Locale;
}

export function TripCard({ trip, locale }: TripCardProps) {
  const t = useTranslations("trips");
  const title = getLocalizedTripField(trip, "title", locale) ?? trip.title_no;
  const tagline = getLocalizedTripField(trip, "tagline", locale);
  const image = getTripImage(trip);

  return (
    <Link
      href={`/reiser/${trip.slug}`}
      className="group flex flex-col overflow-hidden border border-primary/10 bg-white transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <div className="relative aspect-[4/3] bg-primary/10">
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
      <article className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">
            {trip.category}
          </p>
          {trip.district && (
            <p className="text-xs text-text/50">· {trip.district}</p>
          )}
        </div>
        <h3 className="mt-2 font-serif text-2xl text-primary">{title}</h3>
        {tagline && (
          <p className="mt-3 text-sm leading-relaxed text-text/70">{tagline}</p>
        )}
        <div className="mt-auto flex items-end justify-between pt-6">
          <div className="text-sm text-text/70">
            {trip.duration_days && (
              <p>{t("days", { count: trip.duration_days })}</p>
            )}
            <p className="mt-1 font-medium text-primary">
              {hasPackagePricing(trip)
                ? getTripCardPriceLabel(trip) ??
                  t("packagePricing")
                : t("fromPrice", {
                    price: formatTripListPrice(trip, locale),
                  })}
            </p>
          </div>
          <span className="text-sm font-medium text-accent group-hover:text-accent/80">
            {t("viewTrip")} →
          </span>
        </div>
      </article>
    </Link>
  );
}
