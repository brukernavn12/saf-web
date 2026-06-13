import Image from "next/image";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/home/SectionHeading";
import { images } from "@/lib/image-registry";

export function AboutSection() {
  const t = useTranslations("home.about");

  return (
    <Section className="bg-white py-20 md:py-28 lg:py-32">
      <div className="grid gap-12 md:grid-cols-[0.95fr_1.05fr] md:items-center md:gap-16 lg:gap-24">
        <div className="relative aspect-[4/5] overflow-hidden bg-primary/10 md:aspect-[3/4]">
          <Image
            src={images.omOss.morten}
            alt={t("title")}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 42vw"
          />
        </div>
        <div className="md:py-4">
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
          <p className="-mt-6 font-serif text-xl leading-relaxed text-primary/90 md:-mt-10 md:text-2xl md:leading-snug">
            {t("lead")}
          </p>
          <p className="mt-8 max-w-xl text-base leading-[1.85] text-text/70 md:mt-10 md:text-lg">
            {t("body")}
          </p>
        </div>
      </div>
    </Section>
  );
}
