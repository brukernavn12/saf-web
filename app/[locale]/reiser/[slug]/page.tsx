import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getTripWithDepartures } from "@/lib/trips";
import { formatLocalizedPriceInfoLines, resolveEurToNokRate } from "@/lib/pricing";
import { Section } from "@/components/ui/Section";
import { TripBookingSection } from "@/components/reiser/TripBookingSection";
import { TripItinerarySection } from "@/components/reiser/TripItinerarySection";
import { TripParticipationSection } from "@/components/reiser/TripParticipationSection";
import type { Locale } from "@/types";
import {
  formatTripListPrice,
  formatTripPriceInfoLines,
  getLocalizedGroupSize,
  getLocalizedPriceInfo,
  getLocalizedTripField,
  getLocalizedTripStringArray,
  getTripImage,
  getTripProgramEntries,
  showTripStandardPrice,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

const TRIP_CATEGORY_KEYS = [
  "vin-gastronomi",
  "Vin & gastronomi",
  "aktiv-natur",
  "Aktiv natur",
  "kultur",
  "vindrueplukking",
] as const;

type TripCategoryKey = (typeof TRIP_CATEGORY_KEYS)[number];

function getTripCategoryLabel(
  category: string | null | undefined,
  t: Awaited<ReturnType<typeof getTranslations<"tripDetail">>>
): string | null {
  if (!category) {
    return null;
  }

  if ((TRIP_CATEGORY_KEYS as readonly string[]).includes(category)) {
    return t(`categories.${category as TripCategoryKey}`);
  }

  return category;
}

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
  const eurToNokRate = resolveEurToNokRate(null, trip);
  const title = getLocalizedTripField(trip, "title", locale) ?? trip.title_no;
  const tagline = getLocalizedTripField(trip, "tagline", locale);
  const description = getLocalizedTripField(trip, "description", locale);
  const includes = getLocalizedTripStringArray(trip, "includes", locale);
  const excludes = getLocalizedTripStringArray(trip, "excludes", locale);
  const program = getTripProgramEntries(trip, locale);
  const priceInfo = getLocalizedPriceInfo(trip, locale);
  const priceInfoLines = priceInfo
    ? locale === "no"
      ? formatTripPriceInfoLines(priceInfo)
      : eurToNokRate != null
        ? formatLocalizedPriceInfoLines(priceInfo, locale, eurToNokRate)
        : formatTripPriceInfoLines(priceInfo)
    : null;
  const heroImage = getTripImage(trip);
  const groupSize = getLocalizedGroupSize(trip, locale);
  const categoryLabel = getTripCategoryLabel(trip.category, t);

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

      <Section className={heroImage ? "pt-12" : undefined}>
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">
            {categoryLabel}
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
          {(priceInfoLines || showTripStandardPrice(trip)) && (
            <div className={priceInfoLines ? "min-w-full sm:min-w-[280px] flex-1" : undefined}>
              <p className="text-xs uppercase tracking-wider text-text/50">
                {t("price")}
              </p>
              {priceInfoLines ? (
                <ul className="mt-2 space-y-1.5 font-medium text-primary">
                  {priceInfoLines.map((line) => (
                    <li key={line} className="leading-snug">
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 font-medium text-primary">
                  {formatTripListPrice(trip, locale, eurToNokRate)}
                </p>
              )}
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
          {groupSize && (
            <div>
              <p className="text-xs uppercase tracking-wider text-text/50">
                {t("groupSize")}
              </p>
              <p className="mt-1 font-medium text-primary">{groupSize}</p>
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

        <div className={description ? "mt-14" : "mt-10"}>
          <TripBookingSection
            trip={trip}
            departures={departures}
            locale={locale}
            eurToNokRate={eurToNokRate}
          />
        </div>

        {program && program.length > 0 && (
          <TripItinerarySection
            itinerary={program}
            title={t("program")}
            locale={locale}
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

        <TripParticipationSection locale={locale} />
      </Section>
    </>
  );
}
