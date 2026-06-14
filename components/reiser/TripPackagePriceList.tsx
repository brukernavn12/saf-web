"use client";

import { useTranslations } from "next-intl";
import type { Trip } from "@/types";
import {
  TRIP_PACKAGE_PRICE_NIGHT_KEYS,
  tripHasStructuredPackagePrice,
} from "@/lib/trip-package-price";

interface TripPackagePriceListProps {
  trip: Trip;
}

export function TripPackagePriceList({ trip }: TripPackagePriceListProps) {
  const t = useTranslations("tripDetail");

  if (!tripHasStructuredPackagePrice(trip.slug)) {
    return null;
  }

  const baseKey = `packagePrice.${trip.slug}`;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-wider text-text/50">
          {t(`${baseKey}.sharedLabel`)}
        </p>
        <ul className="mt-2 space-y-1.5 font-medium text-primary">
          {TRIP_PACKAGE_PRICE_NIGHT_KEYS.map((nights) => (
            <li key={`shared-${nights}`} className="leading-snug">
              {t(`${baseKey}.shared.${nights}`)}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-text/50">
          {t(`${baseKey}.singleLabel`)}
        </p>
        <ul className="mt-2 space-y-1.5 font-medium text-primary">
          {TRIP_PACKAGE_PRICE_NIGHT_KEYS.map((nights) => (
            <li key={`single-${nights}`} className="leading-snug">
              {t(`${baseKey}.single.${nights}`)}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm leading-relaxed text-text/60">
        {t(`${baseKey}.moreNightsNote`)}
      </p>
    </div>
  );
}
