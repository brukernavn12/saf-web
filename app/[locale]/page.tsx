import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { CategoryCards } from "@/components/home/CategoryCards";
import { AboutSection } from "@/components/home/AboutSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import type { Locale } from "@/lib/locales";

export default function HomePage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <CategoryCards />
      <AboutSection />
      <ReviewsSection />
      <NewsletterSignup />
    </>
  );
}
