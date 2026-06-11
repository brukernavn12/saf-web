import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getActiveTrips } from "@/lib/trips";
import { isSupabaseConfigured } from "@/lib/supabase";
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
  const trips = configured ? await getActiveTrips() : [];

  return (
    <Section className="pt-32">
      <div className="mb-12 max-w-2xl">
        <h1 className="font-serif text-4xl text-primary md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-text/75">
          {t("description")}
        </p>
      </div>
      {trips.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="border border-primary/10 bg-white p-8 text-text/70">
          {configured ? t("noTrips") : t("configError")}
        </p>
      )}
    </Section>
  );
}
