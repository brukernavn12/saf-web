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
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : `${locale}-NO`, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(eur);
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
