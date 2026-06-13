import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/types";

export default async function PaymentCancelledPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "payment" });

  return (
    <Section narrow>
      <h1 className="font-serif text-3xl text-primary">{t("cancelledTitle")}</h1>
      <p className="mt-4 leading-relaxed text-text/75">
        {t("cancelledDescription")}
      </p>
      <Link
        href="/reiser"
        className="mt-8 inline-block border border-primary/20 px-6 py-3 text-sm font-medium text-primary"
      >
        {t("backToTrips")}
      </Link>
    </Section>
  );
}
