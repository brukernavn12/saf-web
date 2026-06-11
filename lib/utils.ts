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

export function hasPackagePricing(
  trip: Pick<Trip, "price_info">
): boolean {
  return Boolean(trip.price_info?.trim());
}

/** Split pipe-separated price_info into readable lines. */
export function formatTripPriceInfoLines(priceInfo: string): string[] {
  return priceInfo
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
}

/** Short label for trip cards, e.g. "fra kr 4.500". */
export function getTripCardPriceLabel(trip: Trip): string | null {
  if (!hasPackagePricing(trip)) {
    return null;
  }
  const match = trip.price_info!.match(/kr\s*[\d.]+/i);
  return match ? `fra ${match[0].trim()}` : null;
}

export function formatTripListPrice(trip: Trip, locale: Locale = "no"): string {
  if (hasPackagePricing(trip)) {
    return getTripCardPriceLabel(trip) ?? trip.price_info!;
  }
  if (usesNokPricing(trip)) {
    return formatPriceNok(trip.price_nok, locale);
  }
  if (trip.base_price_eur > 0) {
    return formatPriceEur(trip.base_price_eur, locale);
  }
  return formatPriceEur(0, locale);
}

export function showTripStandardPrice(trip: Trip): boolean {
  return !hasPackagePricing(trip) && (usesNokPricing(trip) || trip.base_price_eur > 0);
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

/** Compact range for cards, e.g. "7.–11. mai 2026". */
export function formatDepartureRange(
  startDate: string,
  endDate: string,
  locale: Locale = "no"
): string {
  const localeTag = locale === "en" ? "en-GB" : `${locale}-NO`;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const sameMonth =
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();

  if (sameMonth) {
    const dayFmt = new Intl.DateTimeFormat(localeTag, { day: "numeric" });
    const endFmt = new Intl.DateTimeFormat(localeTag, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `${dayFmt.format(start)}.–${endFmt.format(end)}`;
  }

  return `${formatDate(startDate, locale, {
    day: "numeric",
    month: "short",
  })} – ${formatDate(endDate, locale)}`;
}

/** Trip card range, e.g. "30. apr – 4. mai 2027". */
export function formatDepartureCardRange(
  startDate: string,
  endDate: string,
  locale: Locale = "no"
): string {
  const localeTag = locale === "en" ? "en-GB" : `${locale}-NO`;
  const formatPart = (date: string, withYear: boolean) => {
    const d = new Date(date);
    const day = new Intl.DateTimeFormat(localeTag, { day: "numeric" }).format(d);
    const month = new Intl.DateTimeFormat(localeTag, { month: "short" })
      .format(d)
      .replace(/\.$/, "");
    if (withYear) {
      return `${day}. ${month} ${d.getFullYear()}`;
    }
    return `${day}. ${month}`;
  };

  return `${formatPart(startDate, false)} – ${formatPart(endDate, true)}`;
}

const LOCALIZED_TRIP_FIELD_LOCALES: Locale[] = ["no", "sv", "en"];

function readNonEmptyTripString(
  trip: Trip,
  key: keyof Trip
): string | null {
  const value = trip[key];
  if (typeof value === "string" && value.trim() !== "") {
    return value;
  }
  return null;
}

/** Requested locale → Norwegian → first other available translation. */
export function getLocalizedTripField(
  trip: Trip,
  field: "title" | "tagline" | "description",
  locale: Locale
): string | null {
  const chain = [
    locale,
    ...LOCALIZED_TRIP_FIELD_LOCALES.filter((loc) => loc !== locale),
  ] as Locale[];

  for (const loc of chain) {
    const value = readNonEmptyTripString(trip, `${field}_${loc}` as keyof Trip);
    if (value) {
      return value;
    }
  }

  return null;
}

/** Localized string arrays with Norwegian fallback (includes/excludes are no-only in DB). */
export function getLocalizedTripStringArray(
  trip: Trip,
  field: "includes" | "excludes"
): string[] | null {
  const key = `${field}_no` as keyof Trip;
  const value = trip[key];
  if (Array.isArray(value) && value.length > 0) {
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

/** Normalize itinerary from Supabase (text[] may arrive as array, JSON string, or null). */
export function normalizeTripItinerary(value: unknown): string[] | null {
  if (value == null) return null;

  if (Array.isArray(value)) {
    const items = value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
    return items.length > 0 ? items : null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    try {
      return normalizeTripItinerary(JSON.parse(trimmed));
    } catch {
      return [trimmed];
    }
  }

  return null;
}

/** Split "Dag 1: Beskrivelse" into label and body for itinerary rows. */
export function parseItineraryDay(
  entry: string,
  index: number
): { day: string; description: string } {
  const trimmed = entry.trim();
  const match = trimmed.match(/^Dag\s+(\d+)\s*:\s*(.+)$/i);
  if (match) {
    return { day: `Dag ${match[1]}`, description: match[2].trim() };
  }

  const enMatch = trimmed.match(/^Day\s+(\d+)\s*:\s*(.+)$/i);
  if (enMatch) {
    return { day: `Day ${enMatch[1]}`, description: enMatch[2].trim() };
  }

  return { day: `Dag ${index + 1}`, description: trimmed };
}
