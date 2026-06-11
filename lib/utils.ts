import { getTripImageUrls } from "@/lib/image-registry";
import type { Locale, Trip } from "@/types";

function normalizeLocalImagePath(path: string): string {
  const segments = path.split("/");
  const filename = segments.pop() ?? "";
  try {
    segments.push(encodeURIComponent(decodeURIComponent(filename)));
  } catch {
    segments.push(encodeURIComponent(filename));
  }
  return segments.join("/");
}

function isLocalImagePath(path: string): boolean {
  return path.startsWith("/images/");
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(eur: number, locale: Locale = "no"): string {
  return formatPriceEur(eur, locale);
}

export function formatPriceEur(eur: number, locale: Locale = "no"): string {
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : `${locale}-NO`, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(eur);
}

export function usesNokPricing(
  trip: Pick<Trip, "price_nok">
): trip is Trip & { price_nok: number } {
  return trip.price_nok != null && trip.price_nok > 0;
}

/** Norwegian/Swedish style: kr 19.200 */
export function formatPriceNok(nok: number, locale: Locale = "no"): string {
  const rounded = Math.round(nok);

  if (locale === "en") {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "NOK",
      maximumFractionDigits: 0,
    }).format(rounded);
  }

  const grouped = rounded.toLocaleString(locale === "sv" ? "sv-SE" : "nb-NO", {
    maximumFractionDigits: 0,
  });
  return `kr ${grouped.replace(/\u00A0|\s/g, ".")}`;
}

export function eurToDisplayNok(
  eur: number,
  trip: Pick<Trip, "price_nok" | "base_price_eur">
): number {
  if (!usesNokPricing(trip) || trip.base_price_eur <= 0) {
    return Math.round(eur);
  }
  return Math.round(eur * (trip.price_nok / trip.base_price_eur));
}

export function formatTripListPrice(trip: Trip, locale: Locale = "no"): string {
  if (usesNokPricing(trip)) {
    return formatPriceNok(trip.price_nok, locale);
  }
  return formatPriceEur(trip.base_price_eur, locale);
}

export function formatDeparturePrice(
  trip: Trip,
  priceEur: number | null | undefined,
  locale: Locale = "no"
): string | null {
  if (priceEur == null) {
    return null;
  }
  if (usesNokPricing(trip)) {
    return formatPriceNok(eurToDisplayNok(priceEur, trip), locale);
  }
  return formatPriceEur(priceEur, locale);
}

/** Format a EUR-based booking amount for display (scales to NOK when trip uses price_nok). */
export function formatTripAmount(
  eur: number,
  trip: Pick<Trip, "price_nok" | "base_price_eur">,
  locale: Locale = "no"
): string {
  if (usesNokPricing(trip)) {
    return formatPriceNok(eurToDisplayNok(eur, trip), locale);
  }
  return formatPriceEur(eur, locale);
}

export function formatDate(
  date: string,
  locale: Locale = "no",
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(
    locale === "en" ? "en-GB" : `${locale}-NO`,
    options ?? { day: "numeric", month: "long", year: "numeric" }
  ).format(new Date(date));
}

export function getLocalizedTripField(
  trip: Trip,
  field: "title" | "tagline" | "description",
  locale: Locale
): string | null {
  const key = `${field}_${locale}` as keyof Trip;
  const fallbackKey = `${field}_no` as keyof Trip;
  const value = trip[key] ?? trip[fallbackKey];

  if (typeof value === "string") {
    return value;
  }

  return null;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://languedoc.no";
}

export function getTripImage(trip: Trip): string | null {
  const raw = trip.image_urls?.[0] ?? trip.image_url ?? null;

  if (raw && isLocalImagePath(raw)) {
    return normalizeLocalImagePath(raw);
  }

  try {
    return getTripImageUrls(trip.slug).imageUrl;
  } catch {
    // Unknown slug – no registry assignment
  }

  return raw;
}
