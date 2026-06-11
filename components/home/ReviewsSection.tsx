import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";

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
    <Section className="border-t border-primary/10 bg-cream">
      <div className="mb-12 max-w-2xl">
        <h2 className="font-serif text-3xl text-primary md:text-4xl">
          {t("title")}
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="border border-primary/10 bg-white p-8 text-center">
          <p className="font-serif text-5xl text-accent md:text-6xl">100%</p>
          <p className="mt-3 text-sm leading-relaxed text-text/75">
            {t("stats.recommend")}
          </p>
        </div>
        <div className="border border-primary/10 bg-white p-8 text-center">
          <p className="font-serif text-5xl text-accent md:text-6xl">100%</p>
          <p className="mt-3 text-sm leading-relaxed text-text/75">
            {t("stats.balance")}
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviewKeys.map((key) => {
          const author = t(`${key}.author`);
          const hasAuthor = author.length > 0;

          return (
            <blockquote
              key={key}
              className="flex flex-col border border-primary/10 bg-white p-8"
            >
              <p className="flex-1 text-sm leading-relaxed text-text/80">
                &ldquo;{t(`${key}.quote`)}&rdquo;
              </p>
              {hasAuthor && (
                <footer className="mt-6 text-xs uppercase tracking-wider text-accent">
                  {author}
                </footer>
              )}
            </blockquote>
          );
        })}
      </div>

      <figure className="relative mt-16 border-l-4 border-accent bg-primary px-8 py-10 md:px-12 md:py-14">
        <blockquote className="font-serif text-xl leading-relaxed text-cream md:text-2xl">
          &ldquo;{t("featured.quote")}&rdquo;
        </blockquote>
        <figcaption className="mt-6 text-sm tracking-wide text-cream/70">
          {t("featured.attribution")}
        </figcaption>
      </figure>
    </Section>
  );
}
