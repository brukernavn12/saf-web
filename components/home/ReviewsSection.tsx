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
    <>
      <section className="bg-primary py-28 md:py-40 lg:py-48">
        <div className="mx-auto max-w-6xl px-8 md:px-10 lg:px-12">
          <blockquote className="max-w-4xl font-serif text-2xl leading-relaxed text-cream md:text-4xl md:leading-snug lg:text-[2.75rem] lg:leading-[1.18]">
            &ldquo;{t("featured.quote")}&rdquo;
          </blockquote>
          <p className="mt-12 text-sm tracking-[0.16em] text-cream/55 md:mt-16 md:text-base">
            — {t("featured.attribution")}
          </p>
        </div>
      </section>

      <Section className="bg-cream py-32 md:py-44 lg:py-52">
        <SectionHeading
          number="03"
          eyebrow={t("eyebrow")}
          title={t("title")}
        />

        <div className="grid gap-16 md:grid-cols-2 md:gap-x-20 lg:gap-x-28">
          <div>
            <p className="font-serif text-7xl leading-none text-accent md:text-8xl lg:text-9xl">
              100<span className="text-5xl md:text-6xl lg:text-7xl">%</span>
            </p>
            <p className="mt-8 max-w-xs text-sm leading-relaxed text-text/60 md:mt-10 md:text-base">
              {t("stats.recommend")}
            </p>
          </div>
          <div>
            <p className="font-serif text-7xl leading-none text-accent md:text-8xl lg:text-9xl">
              100<span className="text-5xl md:text-6xl lg:text-7xl">%</span>
            </p>
            <p className="mt-8 max-w-xs text-sm leading-relaxed text-text/60 md:mt-10 md:text-base">
              {t("stats.balance")}
            </p>
          </div>
        </div>

        <div className="mt-24 grid gap-x-16 gap-y-20 md:mt-32 md:grid-cols-2 md:gap-x-20 md:gap-y-24 lg:mt-40 lg:gap-x-28 lg:gap-y-28">
          {reviewKeys.map((key) => (
            <blockquote
              key={key}
              className="m-0 border-l-2 border-accent pl-6 md:pl-8"
            >
              <p className="font-serif text-base italic leading-[1.65] text-text/85 md:text-[1.08rem] md:leading-[1.7]">
                &ldquo;{t(`${key}.quote`)}&rdquo;
              </p>
            </blockquote>
          ))}
        </div>
      </Section>
    </>
  );
}
