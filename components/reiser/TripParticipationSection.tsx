import { getTranslations } from "next-intl/server";
import type { Locale } from "@/types";

interface TripParticipationSectionProps {
  locale: Locale;
}

export async function TripParticipationSection({
  locale,
}: TripParticipationSectionProps) {
  const t = await getTranslations({ locale, namespace: "tripDetail" });
  const considerations = t.raw("participation.fitness.considerations") as string[];

  return (
    <section className="mt-14 max-w-3xl">
      <div className="space-y-10 border-y border-primary/10 py-10">
        <div>
          <h2 className="font-serif text-2xl text-primary md:text-3xl">
            {t("participation.fitness.title")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-text/80">
            {t("participation.fitness.intro")}
          </p>
          <ul className="mt-4 space-y-2">
            {considerations.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-relaxed text-text/75"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-text/80">
            <p>{t("participation.fitness.recommendation")}</p>
            <p>{t("participation.fitness.disclosure")}</p>
            <p>{t("participation.fitness.accommodation")}</p>
            <p>{t("participation.fitness.safety")}</p>
            <p>{t("participation.fitness.contact")}</p>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-primary md:text-3xl">
            {t("participation.age.title")}
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-text/80">
            <p>{t("participation.age.intro")}</p>
            <p>{t("participation.age.minimum")}</p>
            <p>{t("participation.age.exceptions")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
