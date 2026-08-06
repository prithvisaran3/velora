"use client";

/**
 * True while the hero still covers the top strip of the viewport.
 *
 * Two things need this answer and they must agree: the header (transparent on
 * the thread ground, solid once past it) and the WhatsApp affordance (absent
 * while the hero's own CTAs are on screen, present afterwards). A route with no
 * `[data-hero]` is never "over hero", so every other page gets the settled
 * state from its first paint.
 */

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function useOverHero(): boolean {
  const pathname = usePathname();
  // Only a route that renders a hero can start in the overlay state. Deriving
  // the first value from the path means the home page is server-rendered
  // already transparent — no solid band flashing for a frame.
  const [overHero, setOverHero] = useState(pathname === "/");

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) {
      setOverHero(false);
      return;
    }
    setOverHero(true);

    const headerH =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--header-h"),
        10
      ) || 72;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // A hero that has not been laid out yet reports zero height and so
        // "not intersecting" — which would latch the settled state over a hero
        // about to fill the screen. Wait for a real box.
        if (entry.boundingClientRect.height === 0) return;
        setOverHero(entry.isIntersecting);
      },
      { rootMargin: `-${headerH}px 0px 0px 0px`, threshold: 0 }
    );
    observer.observe(hero);

    // Seed from geometry once layout has happened, so the first state does not
    // depend on when the observer's first callback lands.
    const seed = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      if (rect.height > 0) setOverHero(rect.bottom > headerH);
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(seed);
    };
  }, [pathname]);

  return overHero;
}
