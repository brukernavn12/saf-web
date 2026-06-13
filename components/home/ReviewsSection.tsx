import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/home/SectionHeading";

const reviewKeys = [
  "review1",
  "review2",
  "review3",
  "review4",
  "review5",
  "review6",
] as const;

export function ReviewsSection() {
  const t = useTranslations("home.reviews");

  return (
    <Section className="border-t border-primary/10 bg-cream py-20 md:py-28 lg:py-32">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

      <div className="grid gap-8 sm:grid-cols-2 lg:gap-12">
        <div className="bg-white px-10 py-12 text-center shadow-sm md:px-12 md:py-16">
          <p className="font-serif text-6xl leading-none text-accent md:text-7xl">
            100%
          </p>
          <p className="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-text/70 md:text-base">
            {t("stats.recommend")}
          </p>
        </div>
        <div className="bg-white px-10 py-12 text-center shadow-sm md:px-12 md:py-16">
          <p className="font-serif text-6xl leading-none text-accent md:text-7xl">
            100%
          </p>
          <p className="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-text/70 md:text-base">
            {t("stats.balance")}
          </p>
        </div>
      </div>

      <div className="mt-16 grid gap-8 md:mt-20 md:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:gap-12">
        {reviewKeys.map((key) => {
          const author = t(`${key}.author`);
          const hasAuthor = author.length > 0;

          return (
            <blockquote
              key={key}
              className="flex flex-col bg-white p-9 shadow-sm md:p-10"
            >
              <p className="flex-1 font-serif text-lg leading-relaxed text-text/85 md:text-xl md:leading-relaxed">
                &ldquo;{t(`${key}.quote`)}&rdquo;
              </p>
              {hasAuthor && (
                <footer className="mt-8 text-[11px] uppercase tracking-[0.2em] text-accent">
                  {author}
                </footer>
              )}
            </blockquote>
          );
        })}
      </div>

      <figure className="relative mt-20 bg-primary px-10 py-14 md:mt-28 md:px-16 md:py-20 lg:px-20 lg:py-24">
        <blockquote className="max-w-4xl font-serif text-2xl leading-relaxed text-cream md:text-3xl md:leading-snug lg:text-4xl lg:leading-snug">
          &ldquo;{t("featured.quote")}&rdquo;
        </blockquote>
        <figcaption className="mt-8 text-sm tracking-[0.12em] text-cream/65 md:mt-10">
          {t("featured.attribution")}
        </figcaption>
      </figure>
    </Section>
  );
}
