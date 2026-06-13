import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { LanguedocSection } from "@/components/languedoc/LanguedocSection";
import { images } from "@/lib/image-registry";
import type { Locale } from "@/types";

export default async function LanguedocPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "languedoc" });

  return (
    <Section>
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-4xl text-primary md:text-5xl lg:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-6 font-serif text-xl leading-snug text-primary/90 md:text-2xl">
          {t("subtitle")}
        </p>

        <LanguedocSection
          imageSrc={images.languedoc.intro}
          imageAlt={t("title")}
        >
          <p>{t("intro")}</p>
        </LanguedocSection>

        <LanguedocSection
          title={t("where.title")}
          imageSrc={images.languedoc.where}
          imageAlt={t("where.title")}
          reverse
        >
          <p>{t("where.body")}</p>
        </LanguedocSection>

        <LanguedocSection
          title={t("stay.title")}
          imageSrc={images.languedoc.stay}
          imageAlt={t("stay.title")}
        >
          <p>{t("stay.body")}</p>
        </LanguedocSection>

        <LanguedocSection
          title={t("stay.hirondelle.title")}
          imageSrc={images.languedoc.hirondelle}
          imageAlt={t("stay.hirondelle.title")}
          reverse
        >
          <p>{t("stay.hirondelle.body")}</p>
        </LanguedocSection>

        <LanguedocSection
          title={t("stay.villaBelle.title")}
          imageSrc={images.languedoc.villaBelle}
          imageAlt={t("stay.villaBelle.title")}
        >
          <p>{t("stay.villaBelle.body")}</p>
        </LanguedocSection>

        <LanguedocSection
          imageSrc={images.languedoc.propertiesClosing}
          imageAlt={t("stay.title")}
          reverse
        >
          <p>{t("stay.closing")}</p>
        </LanguedocSection>

        <p className="border-t border-primary/10 py-16 text-center font-serif text-2xl leading-snug text-primary md:py-20 md:text-3xl md:leading-snug lg:text-4xl">
          {t("statement")}
        </p>
      </div>
    </Section>
  );
}
