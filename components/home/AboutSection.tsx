import Image from "next/image";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { images } from "@/lib/image-registry";

export function AboutSection() {
  const t = useTranslations("home.about");

  return (
    <Section className="bg-white" narrow>
      <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
        <div className="relative aspect-[4/5] overflow-hidden bg-primary/10">
          <Image
            src={images.omOss.morten}
            alt={t("title")}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
        <div>
          <h2 className="font-serif text-3xl text-primary md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-text/85">
            {t("lead")}
          </p>
          <p className="mt-4 leading-relaxed text-text/75">{t("body")}</p>
        </div>
      </div>
    </Section>
  );
}
