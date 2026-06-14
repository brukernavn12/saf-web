import { getTranslations } from "next-intl/server";
import { buildFaqPageSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

const FAQ_KEYS = [
  "flights",
  "included",
  "privateGroup",
  "payment",
  "age",
] as const;

export async function FaqSection() {
  const t = await getTranslations("faq");

  const items = FAQ_KEYS.map((key) => ({
    question: t(`items.${key}.question`),
    answer: t(`items.${key}.answer`),
  }));

  return (
    <section
      id="faq"
      className="scroll-mt-24 border-t border-primary/10 bg-cream-dark py-20 md:py-28"
      aria-labelledby="faq-heading"
    >
      <JsonLd data={buildFaqPageSchema(items)} />
      <div className="mx-auto max-w-3xl px-6">
        <h2
          id="faq-heading"
          className="font-serif text-3xl text-primary md:text-4xl"
        >
          {t("title")}
        </h2>
        <dl className="mt-10 space-y-8">
          {items.map((item) => (
            <div key={item.question}>
              <dt className="font-medium text-primary">{item.question}</dt>
              <dd className="mt-2 text-base leading-relaxed text-text/75">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
