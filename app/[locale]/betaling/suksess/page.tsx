import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/types";

export default async function PaymentSuccessPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "payment" });

  return (
    <Section narrow>
      <h1 className="font-serif text-3xl text-primary">{t("successTitle")}</h1>
      <p className="mt-4 leading-relaxed text-text/75">{t("successDescription")}</p>
      <Link
        href="/reiser"
        className="mt-8 inline-block border border-accent bg-accent px-6 py-3 text-sm font-medium text-cream"
      >
        {t("backToTrips")}
      </Link>
    </Section>
  );
}
