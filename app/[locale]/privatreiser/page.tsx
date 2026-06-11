import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/types";

export default async function PrivateTripsPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privateTrips" });

  return (
    <Section className="pt-32" narrow>
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
    </Section>
  );
}
