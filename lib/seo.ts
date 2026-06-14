import type { Metadata } from "next";
import {
  openGraphLocaleTag,
  schemaInLanguage,
  type Locale,
} from "@/lib/locales";
import { normalizeEurPrice } from "@/lib/pricing";
import type { Trip } from "@/types";
import {
  getTripImage,
  getSiteUrl,
  usesNokPricing,
} from "@/lib/utils";

export const SEO_LOCALES = ["no", "en", "sv"] as const;
export type SeoLocale = (typeof SEO_LOCALES)[number];

export const DEFAULT_OG_IMAGE = "/images/hero/hero.jpg";

export const STATIC_SEO_PATHS = [
  "/",
  "/reiser",
  "/privatreiser",
  "/languedoc",
  "/om-oss",
  "/kontakt",
] as const;

export function absoluteUrl(path: string): string {
  const base = getSiteUrl().replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function localePath(locale: SeoLocale, pathname: string): string {
  const suffix = pathname === "/" ? "" : pathname;
  return `/${locale}${suffix}`;
}

/** hreflang map: nb → /no/, en → /en/, sv → /sv/, x-default → /no/ */
export function buildHreflangAlternates(
  pathname: string
): Record<string, string> {
  const suffix = pathname === "/" ? "" : pathname;

  return {
    nb: absoluteUrl(`/no${suffix}`),
    en: absoluteUrl(`/en${suffix}`),
    sv: absoluteUrl(`/sv${suffix}`),
    "x-default": absoluteUrl(`/no${suffix}`),
  };
}

function openGraphAlternateLocales(locale: Locale): string[] {
  return SEO_LOCALES.filter((l) => l !== locale).map(openGraphLocaleTag);
}

interface PageMetadataOptions {
  locale: Locale;
  pathname: string;
  title: string;
  description: string;
  ogImage?: string | null;
}

export function buildPageMetadata(options: PageMetadataOptions): Metadata {
  const { locale, pathname, title, description, ogImage } = options;
  const canonical = absoluteUrl(localePath(locale, pathname));
  const image = absoluteUrl(ogImage ?? DEFAULT_OG_IMAGE);
  const meta: Metadata = {
    alternates: {
      canonical,
      languages: buildHreflangAlternates(pathname),
    },
    openGraph: {
      type: "website",
      title,
      url: canonical,
      siteName: "Smaken av Frankrike",
      locale: openGraphLocaleTag(locale),
      alternateLocale: openGraphAlternateLocales(locale),
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || "Smaken av Frankrike",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: [image],
    },
  };

  if (title) {
    meta.title = title;
  }

  if (description) {
    meta.description = description;
    meta.openGraph!.description = description;
    meta.twitter!.description = description;
  }

  return meta;
}

function tripMetaFieldKey(
  field: "title" | "tagline" | "description",
  locale: Locale
): keyof Trip {
  if (locale === "no") {
    return `${field}_no` as keyof Trip;
  }
  if (locale === "en") {
    return `${field}_en` as keyof Trip;
  }
  return `${field}_sv` as keyof Trip;
}

/** Trip copy for SEO – active locale only, no Norwegian fallback. */
export function getStrictTripMetaField(
  trip: Trip,
  field: "title" | "tagline" | "description",
  locale: Locale
): string {
  const value = trip[tripMetaFieldKey(field, locale)];
  return typeof value === "string" ? value.trim() : "";
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Smaken av Frankrike",
    url: getSiteUrl(),
    email: "info@smakenavfrankrike.no",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+47-901-17-435",
        contactType: "customer service",
        areaServed: ["NO", "SE", "FR"],
        availableLanguage: ["Norwegian", "English", "Swedish"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+47-480-06-070",
        contactType: "customer service",
      },
    ],
  };
}

export function buildFaqPageSchema(
  items: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function strictTripProgramEntries(trip: Trip, locale: Locale): string[] | null {
  const programText =
    locale === "en"
      ? trip.program_en?.trim()
      : locale === "no"
        ? trip.program_no?.trim()
        : null;

  if (!programText) {
    return null;
  }

  const entries = programText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return entries.length > 0 ? entries : null;
}

export function buildTouristTripSchema(trip: Trip, locale: Locale) {
  const name = getStrictTripMetaField(trip, "title", locale);
  const description =
    getStrictTripMetaField(trip, "tagline", locale) ||
    getStrictTripMetaField(trip, "description", locale).slice(0, 300) ||
    undefined;

  const program = strictTripProgramEntries(trip, locale);
  const itinerary =
    program && program.length > 0
      ? {
          "@type": "ItemList" as const,
          itemListElement: program.map((day, index) => ({
            "@type": "ListItem" as const,
            position: index + 1,
            name: day,
          })),
        }
      : undefined;

  let price: number | null = null;
  let priceCurrency = "EUR";

  if (usesNokPricing(trip) && locale === "no") {
    price = trip.price_nok;
    priceCurrency = "NOK";
  } else if (trip.base_price_eur > 0) {
    price = normalizeEurPrice(trip.base_price_eur);
    priceCurrency = "EUR";
  } else if (usesNokPricing(trip)) {
    price = trip.price_nok;
    priceCurrency = "NOK";
  }

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    inLanguage: schemaInLanguage(locale),
    ...(name ? { name } : {}),
    ...(description ? { description } : {}),
    touristType: trip.category,
    ...(itinerary ? { itinerary } : {}),
    ...(price != null && price > 0
      ? {
          offers: {
            "@type": "Offer",
            price: String(price),
            priceCurrency,
            availability: "https://schema.org/InStock",
            url: absoluteUrl(localePath(locale, `/reiser/${trip.slug}`)),
          },
        }
      : {}),
    provider: {
      "@type": "Organization",
      name: "Smaken av Frankrike",
      url: getSiteUrl(),
    },
  };
}

export function tripOgImage(trip: Trip): string {
  return getTripImage(trip) ?? DEFAULT_OG_IMAGE;
}

export function buildSitemapEntry(
  locale: SeoLocale,
  pathname: string,
  options: {
    changeFrequency: MetadataRouteChangeFrequency;
    priority: number;
  }
) {
  return {
    url: absoluteUrl(localePath(locale, pathname)),
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    alternates: {
      languages: buildHreflangAlternates(pathname),
    },
  };
}

type MetadataRouteChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";
