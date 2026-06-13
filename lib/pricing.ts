import type { Locale } from "@/lib/locales";

export function roundUpToNearest100(nok: number): number {
  return Math.ceil(nok / 100) * 100;
}

/** Display NOK from EUR using live rate, rounded up to nearest 100 kr. */
export function convertEurToDisplayNok(eur: number, rate: number): number {
  return roundUpToNearest100(eur * rate);
}

export function convertNokToDisplayEur(nok: number, rate: number): number {
  return Math.max(1, Math.round(nok / rate));
}

function formatEur(eur: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : "nb-NO", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(eur);
}

function formatNok(nok: number, locale: Locale): string {
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

function parseGroupedAmount(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) {
    return null;
  }
  const value = Number(digits);
  return Number.isFinite(value) && value > 0 ? value : null;
}

/** Replace kr / NOK / € amounts in a price_info line for the active locale. */
export function localizePriceInfoLine(
  line: string,
  locale: Locale,
  eurToNokRate: number
): string {
  let result = line.replace(
    /(?:kr\s*|NOK\s*)([\d.,\s]+)/gi,
    (match, amount: string) => {
      const nok = parseGroupedAmount(amount);
      if (nok == null) {
        return match;
      }
      if (locale === "en") {
        return formatEur(convertNokToDisplayEur(nok, eurToNokRate), locale);
      }
      return formatNok(nok, locale);
    }
  );

  result = result.replace(/€\s*([\d.,\s]+)/gi, (match, amount: string) => {
    const eur = parseGroupedAmount(amount);
    if (eur == null) {
      return match;
    }
    if (locale === "en") {
      return formatEur(eur, locale);
    }
    return formatNok(convertEurToDisplayNok(eur, eurToNokRate), locale);
  });

  return result;
}

export function formatLocalizedPriceInfoLines(
  priceInfo: string,
  locale: Locale,
  eurToNokRate: number
): string[] {
  return priceInfo
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((line) => localizePriceInfoLine(line, locale, eurToNokRate));
}

/** First price token in a line, for compact card labels ("fra …"). */
export function extractFirstPriceToken(line: string): string | null {
  const eurMatch = line.match(/€[\d.,\s]+/);
  if (eurMatch) {
    return eurMatch[0].trim();
  }
  const nokMatch = line.match(/(?:kr\s*[\d.]+|NOK\s*[\d,]+)/i);
  if (nokMatch) {
    return nokMatch[0].trim();
  }
  return null;
}

export function resolveEurToNokRate(
  fetchedRate: number | null | undefined,
  trip?: { price_nok?: number | null; base_price_eur?: number }
): number | null {
  return getLockedDisplayEurToNokRate(trip);
}

/** Fixed commercial rate for display – never live spot (avoids drift and FX loss on quotes). */
export function getLockedDisplayEurToNokRate(
  trip?: { price_nok?: number | null; base_price_eur?: number }
): number | null {
  if (
    trip?.price_nok != null &&
    trip.price_nok > 0 &&
    trip.base_price_eur != null &&
    trip.base_price_eur > 0
  ) {
    return trip.price_nok / trip.base_price_eur;
  }

  const configured = process.env.NEXT_PUBLIC_EUR_NOK_DISPLAY_RATE?.trim();
  if (configured) {
    const rate = Number(configured);
    if (Number.isFinite(rate) && rate > 0) {
      return rate;
    }
  }

  return null;
}
