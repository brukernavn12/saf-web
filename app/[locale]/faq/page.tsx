import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/types";

export default async function FaqPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "faq" });

  return (
    <Section className="pt-32" narrow>
      <h1 className="font-serif text-4xl text-primary md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg text-text/70">{t("description")}</p>
      <p className="mt-10 text-text/60">{t("comingSoon")}</p>
    </Section>
  );
}
