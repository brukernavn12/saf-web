"use client";

import { useTranslations } from "next-intl";
import type { Trip } from "@/types";
import { getTripSeasonBlockKeys } from "@/lib/trip-season-blocks";

interface TripSeasonBlockListProps {
  trip: Trip;
}

export function TripSeasonBlockList({ trip }: TripSeasonBlockListProps) {
  const t = useTranslations("tripDetail");
  const blockKeys = getTripSeasonBlockKeys(trip.slug);

  if (blockKeys.length === 0) {
    return null;
  }

  const baseKey = `seasonBlock.${trip.slug}`;

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {blockKeys.map((blockKey) => {
        const periodKey = `${baseKey}.${blockKey}.period`;
        const promoKey = `${baseKey}.${blockKey}.promo`;
        const promo = t.has(promoKey) ? t(promoKey) : null;

        return (
          <li
            key={blockKey}
            className="border border-primary/10 bg-cream-dark/60 px-5 py-4"
          >
            <p className="font-serif text-base leading-snug text-primary">
              {t(periodKey)}
            </p>
            {promo && (
              <p className="mt-1.5 text-xs font-medium uppercase tracking-wide text-accent">
                {promo}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
