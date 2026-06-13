import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/home/SectionHeading";
import { images } from "@/lib/image-registry";

export function AboutSection() {
  const t = useTranslations("home.about");

  return (
    <Section className="overflow-hidden bg-white py-32 md:py-44 lg:py-52">
      <Link
        href="/om-oss"
        className="group grid gap-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-28 xl:gap-32"
      >
        <div className="relative lg:-ml-6 lg:pt-12 xl:-ml-12">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="relative aspect-[4/5] overflow-hidden bg-primary/10">
              <Image
                src={images.omOss.elisabeth}
                alt="Elisabeth"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 45vw, 20vw"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden bg-primary/10">
              <Image
                src={images.omOss.mortenPortrait}
                alt="Morten"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 45vw, 20vw"
              />
            </div>
          </div>
          <div
            className="absolute -bottom-6 -right-4 hidden h-32 w-32 border-4 border-accent bg-cream lg:block xl:-right-8"
            aria-hidden
          />
        </div>

        <div className="lg:pt-8">
          <SectionHeading
            number="02"
            eyebrow={t("eyebrow")}
            title={t("title")}
          />

          <blockquote className="relative border-l-4 border-accent pl-8 md:pl-12">
            <p className="font-serif text-2xl leading-snug text-primary md:text-3xl md:leading-snug lg:text-[2.25rem] lg:leading-[1.2]">
              &ldquo;{t("lead")}&rdquo;
            </p>
          </blockquote>

          <span className="mt-12 inline-block text-[11px] uppercase tracking-[0.24em] text-accent transition-colors group-hover:text-primary md:mt-14">
            {t("cta")} →
          </span>
        </div>
      </Link>
    </Section>
  );
}
