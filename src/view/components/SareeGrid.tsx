"use client";

/**
 * 02 · The shop — a grid, not a deck.
 *
 * Count-agnostic by design. Nothing here says how many sarees there are: no
 * "twelve pieces", no month counter, no edit number. 4-up on desktop, 2-up on
 * mobile, LOAD MORE at the end — it works identically at six items and six
 * hundred, and the filters do the narrowing a curated count used to imply.
 *
 * The chips are derived from the catalogue rather than hard-coded, so she
 * never has to tell anyone she has started stocking organza. A fabric only
 * gets a chip once something in stock is made of it.
 */

import React, { useMemo, useState } from "react";
import { Saree } from "@/model/domain/types";
import { Money } from "@/model/domain/money";
import { UI } from "@/content/ui";
import { SareeCard } from "./SareeCard";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

/** Fabric families we recognise, in the order they should appear. */
const FAMILIES = ["Silk", "Cotton", "Organza", "Linen", "Chanderi", "Tissue", "Georgette"] as const;

interface SareeGridProps {
  sarees: readonly Saree[];
  /** Show the fabric and price chips. Colour and occasion pages already filter. */
  filterable?: boolean;
  className?: string;
}

/** The families actually represented in this catalogue, in FAMILIES order. */
function familiesIn(sarees: readonly Saree[]): string[] {
  return FAMILIES.filter((family) =>
    sarees.some((saree) => saree.fabric.toLowerCase().includes(family.toLowerCase()))
  );
}

/**
 * A price chip only makes sense when there is a real spread to cut. The
 * threshold is the median rounded up to the nearest ₹500, so it stays a
 * meaningful line whatever she is stocking.
 */
function priceCut(sarees: readonly Saree[]): number | null {
  if (sarees.length < 4) return null;
  const sorted = [...sarees].map((s) => s.priceInPaise).sort((a, b) => a - b);
  const low = sorted[0];
  const high = sorted[sorted.length - 1];
  if (high - low < 50000) return null; // less than ₹500 apart — nothing to cut
  const median = sorted[Math.floor(sorted.length / 2)];
  return Math.ceil(median / 50000) * 50000;
}

export const SareeGrid: React.FC<SareeGridProps> = ({
  sarees,
  filterable = true,
  className,
}) => {
  const [active, setActive] = useState<string>("all");
  const [shown, setShown] = useState(PAGE_SIZE);

  const families = useMemo(() => (filterable ? familiesIn(sarees) : []), [sarees, filterable]);
  const cut = useMemo(() => (filterable ? priceCut(sarees) : null), [sarees, filterable]);

  const filtered = useMemo(() => {
    if (active === "all") return sarees;
    if (active === "price" && cut !== null) {
      return sarees.filter((saree) => saree.priceInPaise < cut);
    }
    return sarees.filter((saree) =>
      saree.fabric.toLowerCase().includes(active.toLowerCase())
    );
  }, [sarees, active, cut]);

  const visible = filtered.slice(0, shown);
  const hasMore = filtered.length > shown;

  const choose = (key: string) => {
    setActive(key);
    setShown(PAGE_SIZE);
  };

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {filterable && (families.length > 0 || cut !== null) && (
        <div className="flex flex-wrap gap-2.5 md:justify-end">
          <Chip label={UI.shop.filterAll} active={active === "all"} onClick={() => choose("all")} />
          {families.map((family) => (
            <Chip
              key={family}
              label={family.toUpperCase()}
              active={active === family}
              onClick={() => choose(family)}
            />
          ))}
          {cut !== null && (
            <Chip
              label={UI.shop.filterUnder(Money.formatRupees(Money.fromPaise(cut)))}
              active={active === "price"}
              onClick={() => choose("price")}
            />
          )}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="py-12 text-center font-sans text-[14px] text-ink/65">{UI.shop.empty}</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-[26px]">
          {visible.map((saree, index) => (
            <SareeCard
              key={saree.id}
              saree={saree}
              index={index}
              priority={index < 2}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE_SIZE)}
            className="border border-ink/30 px-10 py-4 font-sans text-[11px] uppercase tracking-[0.24em] transition-all duration-500 ease-silk hover:border-saffron hover:tracking-[0.3em] hover:text-saffron"
          >
            {UI.shop.loadMore}
          </button>
        </div>
      )}
    </div>
  );
};

const Chip: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({
  label,
  active,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "border px-4 py-2.5 font-sans text-[10px] uppercase tracking-label transition-colors duration-hover",
      active ? "border-saffron text-saffron" : "border-ink/20 text-ink/60 hover:border-ink/40"
    )}
  >
    {label}
  </button>
);
