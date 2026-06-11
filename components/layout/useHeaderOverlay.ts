"use client";

import { useLayoutEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";

const TRIP_DETAIL_PATH = /^\/reiser\/[^/]+$/;

export function useHeaderOverlay() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isTripDetail = TRIP_DETAIL_PATH.test(pathname);

  const [hasTripHero, setHasTripHero] = useState(isTripDetail);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useLayoutEffect(() => {
    if (!isTripDetail) {
      setHasTripHero(false);
      setScrolledPastHero(false);
      return;
    }

    const hero = document.getElementById("trip-hero");
    const heroPresent = Boolean(hero);
    setHasTripHero(heroPresent);

    if (!hero) {
      setScrolledPastHero(false);
      return;
    }

    const updateScroll = () => {
      const threshold = Math.max(hero.offsetHeight - 96, 0);
      setScrolledPastHero(window.scrollY > threshold);
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, [pathname, isTripDetail]);

  const isOverlay =
    isHome || (isTripDetail && hasTripHero && !scrolledPastHero);
  const isFixed = isTripDetail && hasTripHero;

  return { isOverlay, isFixed };
}
