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

  const paragraphs = [
    "intro",
    "elisabeth",
    "morten",
    "together",
    "closing",
  ] as const;

  return (
    <Section narrow>
      <h1 className="font-serif text-4xl text-primary md:text-5xl lg:text-6xl">
        {t("title")}
      </h1>

      <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10">
        <div className="relative aspect-[4/5] overflow-hidden bg-primary/10">
          <Image
            src={images.omOss.elisabeth}
            alt={t("elisabethPhotoAlt")}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 384px"
            priority
          />
        </div>
        <div className="relative aspect-[4/5] overflow-hidden bg-primary/10">
          <Image
            src={images.omOss.mortenPortrait}
            alt={t("mortenPhotoAlt")}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 384px"
          />
        </div>
      </div>

      <div className="mt-10 space-y-6 leading-relaxed text-text/80">
        {paragraphs.map((key) => (
          <p key={key}>{t(key)}</p>
        ))}
      </div>
      <p className="mt-10 font-serif text-xl leading-snug text-primary md:text-2xl">
        {t("signoff")}
      </p>
    </Section>
  );
}
