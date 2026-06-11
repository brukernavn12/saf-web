import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getTripWithDepartures } from "@/lib/trips";
import { Section } from "@/components/ui/Section";
import { TripBookingSection } from "@/components/reiser/TripBookingSection";
import { TripItinerarySection } from "@/components/reiser/TripItinerarySection";
import type { Locale } from "@/types";
import {
  formatTripListPrice,
  formatTripPriceInfoLines,
  getLocalizedTripField,
  getLocalizedTripStringArray,
  getTripCardPriceLabel,
  getTripImage,
  hasPackagePricing,
  showTripStandardPrice,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TripDetailPage({
  params: { locale, slug },
}: {
  params: { locale: Locale; slug: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tripDetail" });

  const result = await getTripWithDepartures(slug);

  if (!result) {
    notFound();
  }

  const { trip, departures } = result;
  const title = getLocalizedTripField(trip, "title", locale) ?? trip.title_no;
  const tagline = getLocalizedTripField(trip, "tagline", locale);
  const description = getLocalizedTripField(trip, "description", locale);
  const includes = getLocalizedTripStringArray(trip, "includes");
  const excludes = getLocalizedTripStringArray(trip, "excludes");
  const heroImage = getTripImage(trip);

  return (
    <>
      {heroImage && (
        <div
          id="trip-hero"
          className="relative h-[50vh] min-h-[320px] w-full"
        >
          <Image
            src={heroImage}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      <Section className={heroImage ? "pt-12" : "pt-32"}>
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">
            {trip.category}
            {trip.district && ` · ${trip.district}`}
          </p>
          <h1 className="mt-3 font-serif text-4xl text-primary md:text-5xl">
            {title}
          </h1>
          {tagline && (
            <p className="mt-4 text-xl leading-relaxed text-text/80">
              {tagline}
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-6 border-y border-primary/10 py-6 text-sm text-text/70">
          {trip.duration_days && (
            <div>
              <p className="text-xs uppercase tracking-wider text-text/50">
                {t("duration")}
              </p>
              <p className="mt-1 font-medium text-primary">
                {t("days", { count: trip.duration_days })}
                {trip.duration_nights != null &&
                  ` / ${t("nights", { count: trip.duration_nights })}`}
              </p>
            </div>
          )}
          {(trip.price_info || showTripStandardPrice(trip)) && (
            <div className={trip.price_info ? "min-w-full sm:min-w-[280px] flex-1" : undefined}>
              <p className="text-xs uppercase tracking-wider text-text/50">
                {t("price")}
              </p>
              {trip.price_info ? (
                <ul className="mt-2 space-y-1.5 font-medium text-primary">
                  {formatTripPriceInfoLines(trip.price_info).map((line) => (
                    <li key={line} className="leading-snug">
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 font-medium text-primary">
                  {formatTripListPrice(trip, locale)}
                </p>
              )}
            </div>
          )}
          {trip.difficulty_level && (
            <div>
              <p className="text-xs uppercase tracking-wider text-text/50">
                {t("difficulty")}
              </p>
              <p className="mt-1 font-medium capitalize text-primary">
                {trip.difficulty_level}
              </p>
            </div>
          )}
          {trip.meeting_point && (
            <div>
              <p className="text-xs uppercase tracking-wider text-text/50">
                {t("meetingPoint")}
              </p>
              <p className="mt-1 font-medium text-primary">
                {trip.meeting_point}
              </p>
            </div>
          )}
          {trip.min_persons_to_confirm > 0 && (
            <div className="min-w-full sm:min-w-[240px]">
              <p className="text-xs uppercase tracking-wider text-text/50">
                {t("confirmation")}
              </p>
              <p className="mt-1 font-medium text-primary">
                {t("confirmMinimum", { count: trip.min_persons_to_confirm })}
              </p>
            </div>
          )}
        </div>

        {description && (
          <div className="mt-10 max-w-3xl leading-relaxed text-text/80">
            {description.split("\n").map((paragraph, index) => (
              <p key={index} className={index > 0 ? "mt-4" : ""}>
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {trip.itinerary && trip.itinerary.length > 0 && (
          <TripItinerarySection
            itinerary={trip.itinerary}
            title={t("itinerary")}
          />
        )}

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {includes && includes.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl text-primary">
                {t("includes")}
              </h2>
              <ul className="mt-4 space-y-2">
                {includes.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-text/75"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {excludes && excludes.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl text-primary">
                {t("excludes")}
              </h2>
              <ul className="mt-4 space-y-2">
                {excludes.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-text/75"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/30" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-16">
          <TripBookingSection
            trip={trip}
            departures={departures}
            locale={locale}
          />
        </div>
      </Section>
    </>
  );
}
