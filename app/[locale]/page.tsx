import { Hero } from "@/components/home/Hero";
import { CategoryCards } from "@/components/home/CategoryCards";
import { AboutSection } from "@/components/home/AboutSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";

export default function HomePage() {
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
