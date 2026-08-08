import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl().replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/no/", "/en/", "/sv/"],
        disallow: ["/program/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
