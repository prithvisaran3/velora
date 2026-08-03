"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    <section ref={containerRef} className="hidden md:block bg-[#241F1C] text-[#FDF4E4] overflow-hidden my-16">
      <div ref={trackRef} className="flex items-center h-[600px] w-max px-16 gap-16">
        <div className="flex flex-col justify-center max-w-[400px]">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#F5A623]">
            PALLU ARCHITECTURE
          </span>
          <h2 className="font-display text-[36px] font-normal mt-2">
            The story of the fold.
          </h2>
          <p className="font-sans text-[14px] opacity-80 mt-4 leading-relaxed">
            Scroll horizontally through the handwoven sections — body weave, korvai temple junction, and heavy gold zari pallu motifs.
          </p>
        </div>

        {/* Section 1: Body Weave */}
        <div className="w-[500px] h-[440px] placeholder-weave border border-[#F5A623]/30 p-8 flex flex-col justify-between">
          <span className="font-sans text-[11px] uppercase tracking-widest text-[#F8CE5A]">01 / Saree Body</span>
          <span className="font-display text-[24px]">Pure Mulberry Silk Base</span>
        </div>

        {/* Section 2: Korvai Junction */}
        <div className="w-[500px] h-[440px] placeholder-weave border border-[#F5A623]/30 p-8 flex flex-col justify-between">
          <span className="font-sans text-[11px] uppercase tracking-widest text-[#F8CE5A]">02 / Korvai Junction</span>
          <span className="font-display text-[24px]">Hand-Interlocked Temple Border</span>
        </div>

        {/* Section 3: Zari Pallu */}
        <div className="w-[600px] h-[440px] placeholder-weave border border-[#F5A623]/50 p-8 flex flex-col justify-between">
          <span className="font-sans text-[11px] uppercase tracking-widest text-[#F5A623]">03 / Grand Pallu</span>
          <span className="font-display text-[28px] text-[#F8CE5A]">Mangai & Annam Motif Brocade</span>
        </div>
      </div>
    </section>
  );
};
