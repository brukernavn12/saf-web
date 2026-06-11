import { parseItineraryDay } from "@/lib/utils";

interface TripItinerarySectionProps {
  itinerary: string[];
  title: string;
}

export function TripItinerarySection({
  itinerary,
  title,
}: TripItinerarySectionProps) {
  if (itinerary.length === 0) {
    return null;
  }

  return (
    <section className="mt-14 max-w-3xl">
      <h2 className="font-serif text-2xl text-primary md:text-3xl">{title}</h2>
      <ol className="mt-6 divide-y divide-primary/10 border-y border-primary/10">
        {itinerary.map((entry, index) => {
          const { day, description } = parseItineraryDay(entry, index);

          return (
            <li
              key={`${index}-${day}`}
              className="flex gap-4 py-4 sm:grid sm:grid-cols-[5rem_1fr] sm:gap-6"
            >
              <span className="shrink-0 font-serif text-sm font-medium tracking-wide text-accent">
                {day}
              </span>
              <p className="text-sm leading-relaxed text-text/80">{description}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
