export const TRIP_PACKAGE_PRICE_SLUGS = new Set(["vindrueplukkeopplevelse"]);

export const TRIP_PACKAGE_PRICE_NIGHT_KEYS = ["3", "4", "5"] as const;

export function tripHasStructuredPackagePrice(slug: string): boolean {
  return TRIP_PACKAGE_PRICE_SLUGS.has(slug);
}
