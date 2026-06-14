/** Active site locales. */
export const locales = ["no", "en", "sv"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "no";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** BCP 47 hreflang code for each route locale. */
export function hreflangCode(locale: Locale): "nb" | "en" | "sv" {
  if (locale === "no") return "nb";
  if (locale === "en") return "en";
  return "sv";
}

/** Schema.org inLanguage value for the active locale. */
export function schemaInLanguage(locale: Locale): "nb" | "en" | "sv" {
  return hreflangCode(locale);
}

/** Open Graph locale tag for the active route locale. */
export function openGraphLocaleTag(locale: Locale): string {
  if (locale === "no") return "nb_NO";
  if (locale === "en") return "en_GB";
  return "sv_SE";
}
