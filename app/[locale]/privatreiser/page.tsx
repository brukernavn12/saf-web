import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPrivateTripsWithDepartures, getTripBySlug } from "@/lib/trips";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  getLocalizedTripCardCopy,
  getLocalizedTripField,
  getTripImage,
} from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { PrivateExampleCard } from "@/components/privatreiser/PrivateExampleCard";
import { TripCard } from "@/components/reiser/TripCard";
import type { Locale } from "@/types";

const FEATURED_EXAMPLE_SLUG = "krim-og-languedoc-2027";

const STATIC_EXAMPLE_KEYS = ["wineClub", "birthday", "corporate"] as const;

export const dynamic = "force-dynamic";

export default async function PrivateTripsPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privateTrips" });
  const configured = isSupabaseConfigured();
  const [tripItems, featuredExample] = configured
    ? await Promise.all([
        getPrivateTripsWithDepartures(),
        getTripBySlug(FEATURED_EXAMPLE_SLUG),
      ])
    : [[], null];

  const otherTrips = tripItems.filter(
    ({ trip }) => trip.slug !== FEATURED_EXAMPLE_SLUG
  );

  const featuredTitle = featuredExample
    ? getLocalizedTripField(featuredExample, "title", locale) ??
      featuredExample.title_no
    : "";
  const featuredDescription = featuredExample
    ? getLocalizedTripField(featuredExample, "tagline", locale) ?? ""
    : "";

  return (
    <Section>
      <div className="mb-12 max-w-2xl">
        <h1 className="font-serif text-4xl text-primary md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-text/75">
          {t("description")}
        </p>
        <Link
          href="/kontakt"
          className="mt-8 inline-block border border-accent bg-accent px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-accent/90"
        >
          {t("cta")}
        </Link>
      </div>

      <div className="mb-20 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {featuredExample && (
          <PrivateExampleCard
            title={featuredTitle}
            description={featuredDescription}
            href={`/reiser/${featuredExample.slug}`}
            linkLabel={t("example.link")}
            imageSrc={getTripImage(featuredExample) ?? undefined}
            imageAlt={featuredTitle}
          />
        )}
        {STATIC_EXAMPLE_KEYS.map((key) => (
          <PrivateExampleCard
            key={key}
            title={t(`examples.${key}.title`)}
            description={t(`examples.${key}.description`)}
          />
        ))}
      </div>

      {otherTrips.length > 0 && (
        <div className="mb-20">
          <h2 className="font-serif text-2xl text-primary md:text-3xl">
            {t("tripsTitle")}
          </h2>
          <div className="mt-8 space-y-12 md:space-y-16">
            {otherTrips.map(({ trip, departures }, index) => {
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
        </div>
      )}

      <section
        id="bedrift"
        className="scroll-mt-32 border-t border-primary/10 pt-16"
      >
        <h2 className="font-serif text-3xl text-primary md:text-4xl">
          {t("business.title")}
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text/75">
          {t("business.description")}
        </p>
        {featuredExample && (
          <div className="mt-10 max-w-xs">
            <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-accent">
              {t("business.exampleLabel")}
            </p>
            <PrivateExampleCard
              title={featuredTitle}
              description={featuredDescription}
              href={`/reiser/${featuredExample.slug}`}
              linkLabel={t("example.link")}
              imageSrc={getTripImage(featuredExample) ?? undefined}
              imageAlt={featuredTitle}
            />
          </div>
        )}
        <Link
          href="/kontakt"
          className="mt-8 inline-block border border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:border-accent hover:text-accent"
        >
          {t("business.cta")}
        </Link>
      </section>
    </Section>
  );
}
