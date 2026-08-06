"use client";

/**
 * Asking her a question, in the system's own vocabulary.
 *
 * This used to be a 52px peacock circle with the WhatsApp glyph in it — the
 * loudest object on any page, borrowed from another brand's design language,
 * and present nowhere in v9. It is now what every other affordance on the site
 * is: a zero-radius panel with a hairline, a thread over it, and a 0.24em
 * label. It lifts 3px into the warm brown shadow on hover like the primary
 * button, and otherwise it keeps quiet.
 *
 * WHATSAPP also lives in the footer's HELP column and the mobile drawer, so
 * this is a convenience, never the only route to her.
 */

import React from "react";
import { useOverHero } from "./useOverHero";
import { UI } from "@/content/ui";
import { cn } from "@/lib/utils";

interface WhatsAppFabProps {
  /** The PDP's buy bar owns the bottom of the screen; sit above it. */
  hasStickyBar?: boolean;
}

export const WhatsAppFab: React.FC<WhatsAppFabProps> = ({ hasStickyBar = false }) => {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";

  // The hero carries its own two CTAs at the bottom of the screen, and on a
  // phone this would land on top of BROWSE BY COLOUR. Stay out of the way
  // until the hero is behind us; on every other route that is immediately.
  const overHero = useOverHero();

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(UI.whatsapp.prefill)}`}
      target="_blank"
      rel="noreferrer"
      aria-label={UI.whatsapp.aria}
      aria-hidden={overHero}
      tabIndex={overHero ? -1 : undefined}
      className={cn(
        "fixed right-4 z-40 flex min-h-11 flex-col justify-center gap-1.5",
        "border border-ink/20 bg-panel px-4 py-3 no-underline",
        "transition-all duration-500 ease-silk",
        "hover:-translate-y-[3px] hover:border-ink/30 hover:shadow-[0_16px_26px_-12px_rgba(120,84,40,0.7)]",
        "md:right-6",
        hasStickyBar ? "bottom-sticky-bar" : "bottom-6",
        overHero
          ? "pointer-events-none translate-y-3 opacity-0"
          : "pointer-events-auto translate-y-0 opacity-100"
      )}
    >
      <span className="block h-px w-full bg-[var(--thread)]" aria-hidden />
      <span className="whitespace-nowrap font-sans text-[11px] uppercase tracking-[0.24em] text-ink">
        {UI.whatsapp.label}
      </span>
    </a>
  );
};
