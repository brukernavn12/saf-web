import { getTripImageUrls } from "@/lib/image-registry";
import { locales, type Locale } from "@/lib/locales";
import type { Departure, Trip } from "@/types";

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

  const grouped = rounded.toLocaleString("nb-NO", {
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

/** Today's date in Europe/Oslo as YYYY-MM-DD. */
export function todayIsoDateInOslo(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Oslo" }).format(
    new Date()
  );
}

/** Coerce Supabase/API date values to YYYY-MM-DD for safe string comparison. */
export function normalizeIsoDate(value: unknown): string | null {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const match = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : null;
  }
  return null;
}

/** True when start_date is strictly after today (Oslo). */
export function isUpcomingDepartureDate(startDate: unknown): boolean {
  const start = normalizeIsoDate(startDate);
  if (!start) return false;
  return start > todayIsoDateInOslo();
}

export function isUpcomingDeparture(
  departure: Pick<Departure, "start_date">
): boolean {
  return isUpcomingDepartureDate(departure.start_date);
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

const LOCALIZED_TRIP_FIELD_LOCALES: Locale[] = [...locales];

function localizedFieldChain(locale: Locale): Locale[] {
  return [
    locale,
    ...LOCALIZED_TRIP_FIELD_LOCALES.filter((loc) => loc !== locale),
  ];
}

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
  const chain = localizedFieldChain(locale);

  for (const loc of chain) {
    const value = readNonEmptyTripString(trip, `${field}_${loc}` as keyof Trip);
    if (value) {
      return value;
    }
  }

  return null;
}

/** Localized string arrays with Norwegian fallback. */
export function getLocalizedTripStringArray(
  trip: Trip,
  field: "includes" | "excludes",
  locale: Locale
): string[] | null {
  for (const loc of localizedFieldChain(locale)) {
    const key = `${field}_${loc}` as keyof Trip;
    const value = trip[key];
    if (Array.isArray(value) && value.length > 0) {
      return value;
    }
  }

  return null;
}

export function getLocalizedItinerary(
  trip: Trip,
  locale: Locale
): string[] | null {
  if (locale === "en") {
    const en = normalizeTripItinerary(trip.itinerary_en);
    if (en?.length) {
      return en;
    }
  }

  return normalizeTripItinerary(trip.itinerary);
}

export function getLocalizedPriceInfo(
  trip: Trip,
  locale: Locale
): string | null {
  if (locale === "en" && trip.price_info_en?.trim()) {
    return trip.price_info_en.trim();
  }

  return trip.price_info?.trim() ?? null;
}

/** Localized title and tagline for trip cards and listings. */
export function getLocalizedTripCardCopy(
  trip: Trip,
  locale: Locale
): { title: string; tagline: string | null } {
  return {
    title: getLocalizedTripField(trip, "title", locale) ?? trip.title_no,
    tagline: getLocalizedTripField(trip, "tagline", locale),
  };
}

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://saf-web-self.vercel.app"
  );
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
  index: number,
  locale: Locale = "no"
): { day: string; description: string } {
  const trimmed = entry.trim();
  const match = trimmed.match(/^Dag\s+(\d+)\s*:\s*(.+)$/i);
  if (match) {
    return {
      day: locale === "en" ? `Day ${match[1]}` : `Dag ${match[1]}`,
      description: match[2].trim(),
    };
  }

  const enMatch = trimmed.match(/^Day\s+(\d+)\s*:\s*(.+)$/i);
  if (enMatch) {
    return { day: `Day ${enMatch[1]}`, description: enMatch[2].trim() };
  }

  return {
    day: locale === "en" ? `Day ${index + 1}` : `Dag ${index + 1}`,
    description: trimmed,
  };
}
