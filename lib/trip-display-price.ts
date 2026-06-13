import type { Locale } from "@/lib/locales";
import type { Trip } from "@/types";
import {
  formatTripListPrice,
  getTripCardPriceLabel,
  hasPackagePricing,
  showTripStandardPrice,
} from "@/lib/utils";

type TripListTranslations = {
  fromPrice: (values: { price: string }) => string;
  packagePricing: string;
};

export function getTripCardDisplayPrice(
  trip: Trip,
  locale: Locale,
  eurToNokRate: number | null | undefined,
  t: TripListTranslations
): string | null {
  if (hasPackagePricing(trip)) {
    return getTripCardPriceLabel(trip, locale, eurToNokRate) ?? t.packagePricing;
  }

  if (showTripStandardPrice(trip)) {
    return t.fromPrice({
      price: formatTripListPrice(trip, locale, eurToNokRate),
    });
  }

  return null;
}
