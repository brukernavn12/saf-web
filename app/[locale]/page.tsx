import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { CategoryCards } from "@/components/home/CategoryCards";
import { AboutSection } from "@/components/home/AboutSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { FaqSection } from "@/components/home/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPageMetadataCopy } from "@/lib/seo-messages";
import { buildOrganizationSchema, buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/locales";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { title, description } = await getPageMetadataCopy(locale, "home");

  return buildPageMetadata({
    locale,
    pathname: "/",
    title,
    description,
  });
}

export default function HomePage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={buildOrganizationSchema()} />
      <Hero />
      <CategoryCards />
      <AboutSection />
      <ReviewsSection />
      <NewsletterSignup />
      <FaqSection />
    </>
  );
}
