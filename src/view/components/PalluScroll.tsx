"use client";

import React from "react";

/**
 * The approved 2D pallu strip — the poster for moment 05.
 *
 * A native horizontal scroller with snap points. It used to be a GSAP pinned
 * scrub, which was wrong twice over: ScrollTrigger's `pin` lifts the section
 * into a pin-spacer outside React's tree, so React throws the moment it needs
 * to remove it; and a native scroller already works with a trackpad, a touch
 * drag, arrow keys and no JavaScript at all. Only the 3D unroll pins now, and
 * that one is never swapped out once it is up.
 */
export const PalluScroll: React.FC = () => (
  <section className="hidden md:block bg-ink text-cream my-16 py-14">
    <div className="px-16 max-w-[760px]">
      <span className="font-sans text-[10px] uppercase tracking-label-wide text-marigold">
        Anatomy of a saree
      </span>
      <h2 className="font-display text-[36px] font-normal mt-2">
        Six yards, end to end
      </h2>
      <p className="font-sans text-[14px] opacity-80 mt-4 leading-relaxed">
        Body, border, pallu — the three parts every Tamil buyer checks, in that
        order, and the three we photograph in that order.
      </p>
    </div>

    <div className="mt-10 flex gap-10 overflow-x-auto px-16 pb-6 snap-x snap-mandatory">
      <article className="snap-start w-[500px] h-[420px] flex-shrink-0 placeholder-weave border border-marigold/30 p-8 flex flex-col justify-between">
        <span className="font-sans text-[11px] uppercase tracking-widest text-turmeric">
          01 · THE BODY / உடல்
        </span>
        <span className="font-display text-[24px]">
          Six yards of mulberry silk, dyed in the hank before a single thread is
          woven.
        </span>
      </article>

      <article className="snap-start w-[500px] h-[420px] flex-shrink-0 placeholder-weave border border-marigold/30 p-8 flex flex-col justify-between">
        <span className="font-sans text-[11px] uppercase tracking-widest text-turmeric">
          02 · THE BORDER / கரை
        </span>
        <span className="font-display text-[24px]">
          Joined by the korvai technique — a separate warp, three weavers, one
          seam you cannot find.
        </span>
      </article>

      <article className="snap-start w-[600px] h-[420px] flex-shrink-0 placeholder-weave border border-marigold/50 p-8 flex flex-col justify-between">
        <span className="font-sans text-[11px] uppercase tracking-widest text-marigold">
          03 · THE PALLU / முந்தானை
        </span>
        <span className="font-display text-[28px] text-turmeric">
          The end that shows. Half-fine gold zari, paisley after paisley.
        </span>
      </article>
    </div>
  </section>
);
