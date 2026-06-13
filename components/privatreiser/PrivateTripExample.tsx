import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getLocalizedTripField, getTripImage } from "@/lib/utils";
import type { Locale, Trip } from "@/types";

interface PrivateTripExampleProps {
  trip: Trip;
  locale: Locale;
  intro: string;
  sectionTitle: string;
  linkLabel: string;
}

export function PrivateTripExample({
  trip,
  locale,
  intro,
  sectionTitle,
  linkLabel,
}: PrivateTripExampleProps) {
  const title = getLocalizedTripField(trip, "title", locale) ?? trip.title_no;
  const tagline = getLocalizedTripField(trip, "tagline", locale);
  const image = getTripImage(trip);

  return (
    <section className="mb-20 border-y border-primary/10 py-16">
      <div className="max-w-2xl">
        <p className="text-lg leading-relaxed text-text/75">{intro}</p>
        <h2 className="mt-8 font-serif text-2xl text-primary md:text-3xl">
          {sectionTitle}
        </h2>
      </div>

      <Link
        href={`/reiser/${trip.slug}`}
        className="group mt-10 grid overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm transition-shadow hover:shadow-lg md:grid-cols-[1.1fr_1fr]"
      >
        <div className="relative aspect-[4/3] bg-primary/10 md:aspect-auto md:min-h-[320px]">
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>

        <div className="flex flex-col justify-center p-8 md:p-10">
          <h3 className="font-serif text-2xl leading-snug text-primary md:text-3xl">
            {title}
          </h3>
          {tagline && (
            <p className="mt-4 text-base leading-relaxed text-text/70">
              {tagline}
            </p>
          )}
          <span className="mt-8 text-sm font-medium tracking-wide text-accent group-hover:text-accent/80">
            {linkLabel} →
          </span>
        </div>
      </Link>
    </section>
  );
}
