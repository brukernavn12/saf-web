import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { images } from "@/lib/image-registry";
import type { Locale } from "@/types";

export default async function AboutPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const home = await getTranslations({ locale, namespace: "home.about" });

  return (
    <Section className="pt-32" narrow>
      <div className="relative mb-10 aspect-[21/9] overflow-hidden">
        <Image
          src={images.omOss.teamBackground}
          alt={t("title")}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      </div>
      <h1 className="font-serif text-4xl text-primary md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg text-text/70">{t("description")}</p>
      <div className="mt-10 space-y-4 leading-relaxed text-text/80">
        <p className="text-lg">{home("lead")}</p>
        <p>{home("body")}</p>
      </div>
    </Section>
  );
}
