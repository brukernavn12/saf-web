import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/home/SectionHeading";
import { images } from "@/lib/image-registry";
import { cn } from "@/lib/utils";

const categories = [
  {
    key: "trips",
    href: "/reiser",
    image: images.categories.trips,
    reverse: false,
  },
  {
    key: "private",
    href: "/privatreiser",
    image: images.categories.private,
    reverse: true,
  },
  {
    key: "business",
    href: "/privatreiser#bedrift",
    image: images.categories.business,
    reverse: false,
  },
] as const;

export function CategoryCards() {
  const t = useTranslations("home.categories");

  return (
    <Section id="categories" className="scroll-mt-24 bg-cream py-32 md:py-44 lg:py-52">
      <SectionHeading
        number="01"
        eyebrow={t("eyebrow")}
        title={t("title")}
      />

      <div className="space-y-12 md:space-y-16 lg:space-y-20">
        {categories.map(({ key, href, image, reverse }) => {
          const description = t(`${key}.description`);

          return (
            <Link
              key={key}
              href={href}
              className={cn(
                "group grid overflow-hidden bg-cream-dark md:grid-cols-2",
                reverse && "md:[&>*:first-child]:order-2"
              )}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-primary/10 md:aspect-auto md:min-h-[380px]">
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={key === "trips"}
                />
              </div>

              <div className="flex flex-col justify-center px-10 py-16 md:px-16 md:py-20 lg:px-20 lg:py-24">
                <p className="text-[11px] uppercase tracking-[0.32em] text-accent">
                  {t(`${key}.label`)}
                </p>
                <h3 className="mt-6 font-serif text-2xl leading-[1.06] text-primary md:mt-8 md:text-3xl">
                  {t(`${key}.title`)}
                </h3>
                <div className="mt-8 min-h-[3.25rem] md:mt-10">
                  {description.length > 0 && (
                    <p className="max-w-sm text-base leading-[1.8] text-text/60">
                      {description}
                    </p>
                  )}
                </div>
                <span className="mt-12 text-[11px] uppercase tracking-[0.32em] text-accent transition-colors group-hover:text-primary md:mt-14">
                  {t("explore")} →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
