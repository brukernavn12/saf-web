import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/home/SectionHeading";
import { images } from "@/lib/image-registry";

const categories = [
  { key: "trips", href: "/reiser", image: images.categories.trips },
  {
    key: "private",
    href: "/privatreiser",
    image: images.categories.private,
  },
  {
    key: "business",
    href: "/privatreiser#bedrift",
    image: images.categories.business,
  },
] as const;

export function CategoryCards() {
  const t = useTranslations("home.categories");

  return (
    <Section className="bg-cream py-20 md:py-28 lg:py-32">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        className="max-w-3xl"
      />
      <div className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
        {categories.map(({ key, href, image }) => (
          <Link
            key={key}
            href={href}
            className="group flex flex-col bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
          >
            <div className="relative aspect-[5/4] overflow-hidden bg-primary/10">
              <Image
                src={image}
                alt=""
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="flex flex-1 flex-col px-8 py-10 md:px-9 md:py-11">
              <h3 className="font-serif text-2xl leading-snug text-primary md:text-[1.75rem]">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-5 flex-1 text-base leading-[1.75] text-text/70">
                {t(`${key}.description`)}
              </p>
              <span className="mt-8 text-xs uppercase tracking-[0.22em] text-accent">
                {t("explore")} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
