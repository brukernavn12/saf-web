/** Active site locales. Swedish is deprecated — /sv/* redirects to /no. */
export const locales = ["no", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "no";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
