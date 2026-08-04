"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UI } from "@/content/ui";

gsap.registerPlugin(ScrollTrigger);

export const PalluScroll: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          end: () => "+=2400",
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="hidden md:block bg-ink text-cream overflow-hidden my-16">
      <div ref={trackRef} className="flex items-center h-[600px] w-max px-16 gap-16">
        <div className="flex flex-col justify-center max-w-[400px]">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-marigold">
            ANATOMY OF A SAREE
          </span>
          <h2 className="font-display text-[36px] font-normal mt-2">
            Unrolling the Kanchipuram
          </h2>
          <p className="font-sans text-[14px] opacity-80 mt-4 leading-relaxed">
            Scroll horizontally to explore the intricate architecture of a traditional handloom Kanchipuram silk saree, from the body weave to the grand pallu.
          </p>
        </div>

        {/* Section 1: Body Weave */}
        <div className="w-[500px] h-[440px] placeholder-weave border border-marigold/30 p-8 flex flex-col justify-between">
          <span className="font-sans text-[11px] uppercase tracking-widest text-turmeric">1. THE BODY / உடல்</span>
          <span className="font-display text-[24px]">Six yards of pure mulberry silk, dyed and woven with traditional motifs.</span>
        </div>

        {/* Section 2: Korvai Junction */}
        <div className="w-[500px] h-[440px] placeholder-weave border border-marigold/30 p-8 flex flex-col justify-between">
          <span className="font-sans text-[11px] uppercase tracking-widest text-turmeric">2. THE BORDER / கரை</span>
          <span className="font-display text-[24px]">Attached using the ancient Korvai technique, requiring three weavers.</span>
        </div>

        {/* Section 3: Zari Pallu */}
        <div className="w-[600px] h-[440px] placeholder-weave border border-marigold/50 p-8 flex flex-col justify-between">
          <span className="font-sans text-[11px] uppercase tracking-widest text-marigold">3. THE PALLU / முந்தானை</span>
          <span className="font-display text-[28px] text-turmeric">The crowning glory, richly woven with half-fine gold zari.</span>
        </div>
      </div>
    </section>
  );
};
