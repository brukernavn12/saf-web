import type { MetadataRoute } from "next";
import { buildSitemapEntry, SEO_LOCALES, STATIC_SEO_PATHS } from "@/lib/seo";
import { getActiveTripSlugs } from "@/lib/trips";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tripSlugs = await getActiveTripSlugs();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of SEO_LOCALES) {
    for (const path of STATIC_SEO_PATHS) {
      entries.push(
        buildSitemapEntry(locale, path, {
          changeFrequency: path === "/" ? "weekly" : "monthly",
          priority: path === "/" ? 1 : path === "/reiser" ? 0.9 : 0.8,
        })
      );
    }

    for (const slug of tripSlugs) {
      entries.push(
        buildSitemapEntry(locale, `/reiser/${slug}`, {
          changeFrequency: "weekly",
          priority: 0.85,
        })
      );
    }
  }

  return entries;
}
