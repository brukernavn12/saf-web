import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/Section";
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
    <Section className="bg-cream">
      <div className="mb-12 max-w-2xl">
        <h2 className="font-serif text-3xl text-primary md:text-4xl">
          {t("title")}
        </h2>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {categories.map(({ key, href, image }) => (
          <Link
            key={key}
            href={href}
            className="group overflow-hidden border border-primary/10 bg-white transition-colors hover:border-accent/40"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={image}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-8">
              <div className="mb-6 h-1 w-10 bg-accent transition-all group-hover:w-16" />
              <h3 className="font-serif text-2xl text-primary">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-text/75">
                {t(`${key}.description`)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
