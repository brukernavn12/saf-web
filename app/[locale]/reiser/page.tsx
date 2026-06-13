import { getTranslations, setRequestLocale } from "next-intl/server";
import { getActiveTripsWithDepartures } from "@/lib/trips";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getLocalizedTripCardCopy } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { TripCard } from "@/components/reiser/TripCard";
import type { Locale } from "@/types";

export const dynamic = "force-dynamic";

export default async function TripsPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "trips" });
  const configured = isSupabaseConfigured();
  const tripItems = configured ? await getActiveTripsWithDepartures() : [];

  return (
    <Section>
      <div className="mb-12 max-w-2xl">
        <h1 className="font-serif text-4xl text-primary md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-text/75">
          {t("description")}
        </p>
      </div>
      {tripItems.length > 0 ? (
        <div className="space-y-12 md:space-y-16 lg:space-y-20">
          {tripItems.map(({ trip, departures }, index) => {
            const { title, tagline } = getLocalizedTripCardCopy(trip, locale);

            return (
              <TripCard
                key={trip.id}
                trip={trip}
                departures={departures}
                locale={locale}
                title={title}
                tagline={tagline}
                reverse={index % 2 === 1}
              />
            );
          })}
        </div>
      ) : (
        <p className="border border-primary/10 bg-white p-8 text-text/70">
          {configured ? t("noTrips") : t("configError")}
        </p>
      )}
    </Section>
  );
}
