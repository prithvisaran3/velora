"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { SceneView } from "@/three/SceneView";
import { useCanvasReady, useThreeTier } from "@/three/CanvasProvider";
import { THREE_FLAGS } from "@/three/flags";
import { tierAllows } from "@/three/tier";
import { UNROLL } from "@/lib/motion";
import { UNROLL_CAMERA } from "@/three/scenes/palluUnroll/camera";
import { setUnrollProgress } from "@/three/store/unroll";
import { PalluScroll } from "./PalluScroll";

const PalluUnrollScene = dynamic(
  () =>
    import("@/three/scenes/palluUnroll/Scene").then((mod) => mod.PalluUnrollScene),
  { ssr: false, loading: () => null }
);

const ANNOTATIONS = [
  {
    index: "01",
    title: "The body",
    tamil: "உடல்",
    copy: "Six yards of mulberry silk, dyed in the hank before a single thread is woven.",
  },
  {
    index: "02",
    title: "The four-inch border",
    tamil: "கரை",
    copy: "Joined by the korvai technique — a separate warp, three weavers, one seam you cannot find.",
  },
  {
    index: "03",
    title: "The mangai pallu",
    tamil: "முந்தானை",
    copy: "The end that shows. Half-fine gold zari, paisley after paisley, and the reason she turns it over in her hands.",
  },
];

/**
 * 05 · The pallu unroll.
 *
 * Desktop `high` gets the real thing: the section pins for 120vh and scroll
 * drives one uniform that unwinds the cloth off its cylinder, with the three
 * annotations arriving at 0.25, 0.55 and 0.85. Everything else gets the
 * approved 2D strip, and a phone gets staggered stills that need no JS at all.
 */
export const PalluSection: React.FC<{ hex?: string }> = ({
  hex = "#8C1F3D",
}) => {
  const tier = useThreeTier();
  const canvasReady = useCanvasReady();
  const [wide, setWide] = useState(false);
  const section = useRef<HTMLElement>(null);
  const notes = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Latched: once the pinned section is up it stays. A ScrollTrigger pin owns
  // its DOM node, so swapping it back out mid-session is not something React
  // can do safely.
  const [show3D, setShow3D] = useState(false);
  useEffect(() => {
    if (
      THREE_FLAGS.palluUnroll &&
      canvasReady &&
      wide &&
      tierAllows(tier, "palluUnroll")
    ) {
      setShow3D(true);
    }
  }, [canvasReady, wide, tier]);

  useEffect(() => {
    const el = section.current;
    if (!show3D || !el) return;

    let revert: (() => void) | undefined;
    let cancelled = false;

    // GSAP is 45 KB gzip. It is only ever needed by the one desktop moment
    // that pins, so it is fetched at that moment and not before.
    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const context = gsap.context(() => {
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: () => `+=${window.innerHeight * (UNROLL.pinVh / 100)}`,
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            setUnrollProgress(self.progress);
            UNROLL.annotations.forEach((threshold, i) => {
              const note = notes.current[i];
              if (!note) return;
              const opacity = Math.min(
                1,
                Math.max(0, (self.progress - (threshold - 0.1)) / 0.1)
              );
              note.style.opacity = String(opacity);
              note.style.transform = `translateY(${(1 - opacity) * 14}px)`;
            });
          },
        });
      }, el);
      revert = () => context.revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
      setUnrollProgress(0);
    };
  }, [show3D]);

  return (
    <>
      {/* Phones: staggered stills, no JS, no canvas. */}
      <section className="md:hidden bg-ink text-cream px-8 py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="font-sans text-[10px] uppercase tracking-label-wide text-marigold">
            Anatomy of a saree
          </span>
          <h2 className="font-display text-[30px] leading-[1.1]">
            Six yards, end to end
          </h2>
        </div>
        {ANNOTATIONS.map((note, i) => (
          <div key={note.index} className="flex flex-col gap-3">
            <div
              className="h-[120px] w-full border border-marigold/30"
              style={{
                background:
                  i === 2
                    ? "repeating-linear-gradient(96deg, var(--color-marigold) 0 7px, var(--color-turmeric) 7px 14px)"
                    : `repeating-linear-gradient(96deg, ${hex} 0 18px, rgba(36,31,28,0.4) 18px 34px)`,
                marginLeft: `${i * 12}px`,
              }}
              aria-hidden
            />
            <div className="flex items-baseline gap-3">
              <span className="font-sans text-[10px] tracking-label text-marigold">
                {note.index}
              </span>
              <span className="font-display text-[20px]">{note.title}</span>
              <span className="font-tamil text-[15px] text-cream/70">
                {note.tamil}
              </span>
            </div>
            <p className="font-sans text-[13px] leading-[1.75] text-cream/75">
              {note.copy}
            </p>
          </div>
        ))}
      </section>

      {show3D ? (
        <section
          ref={section}
          className="hidden md:block relative h-screen w-full overflow-hidden bg-ink text-cream"
        >
          <SceneView
            className="absolute inset-0"
            order={1}
            camera={UNROLL_CAMERA}
          >
            <PalluUnrollScene hex={hex} />
          </SceneView>

          <div className="relative z-10 flex flex-col gap-2 px-[64px] pt-[72px]">
            <span className="font-sans text-[10px] uppercase tracking-label-wide text-marigold">
              Anatomy of a saree
            </span>
            <h2 className="font-display text-[44px] leading-[1.05] max-w-[520px]">
              Scroll, and the six yards open
            </h2>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-[9vh] z-10 flex justify-between gap-8 px-[64px]">
            {ANNOTATIONS.map((note, i) => (
              <div
                key={note.index}
                ref={(node) => {
                  notes.current[i] = node;
                }}
                className="flex max-w-[280px] flex-col gap-2 border-l border-marigold/50 pl-4 opacity-0"
              >
                <span className="font-sans text-[10px] tracking-label text-marigold">
                  {note.index} · {note.tamil}
                </span>
                <span className="font-display text-[24px] leading-tight">
                  {note.title}
                </span>
                <p className="font-sans text-[12px] leading-[1.8] text-cream/75">
                  {note.copy}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <PalluScroll />
      )}
    </>
  );
};
