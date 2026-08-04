# 3D & motion specification

Six moments, in build order. Every one is dark-stage (`ink #241F1C`), saffron/marigold lit, and has a poster
twin. Reference frames: the first section of `design/Velora Website v2.dc.html`.

## Ground rules

1. **One WebGL context for the whole site.** A `CanvasProvider` mounts a single `<Canvas>` after LCP and keeps
   it across route changes; scenes swap inside it. Never two renderers.
2. **Created after LCP.** Mount on `requestIdleCallback` (fallback `setTimeout 1200ms`) *and* only once the
   hero `<img>` has fired `onLoad`. No scene may be in the critical path.
3. **Device tiering** — decide once in `three/tier.ts` from `navigator.hardwareConcurrency`,
   `deviceMemory`, `matchMedia('(pointer:fine)')` and a 12-frame probe:
   - `high` — all six moments, DPR ≤ 1.75
   - `mid` — hero cloth + colour dye only, DPR ≤ 1.25, cloth grid halved
   - `low` — posters and CSS only, no canvas created
4. `prefers-reduced-motion` ⇒ `low`, always.
5. Every scene exports `{ Scene, Poster }`. The route renders `Poster` first and only ever swaps in `Scene`.
6. Easing everywhere `cubic-bezier(0.16, 1, 0.3, 1)`; durations 600–900ms; values from `lib/motion.ts`.
7. Budget: total three.js + scenes ≤ 220 KB gzip on the first interactive route; each GLB ≤ 400 KB;
   textures 2K max, KTX2/basis where possible. Frame budget 16ms high tier, 33ms mid.

## 01 · Vel loader

Extruded mark on a dark stage. `extrudeGeometry` from the blade path (depth 12, bevel 1.5),
`MeshPhysicalMaterial` (saffron base, roughness .35, metalness .1) with the spine as a separate marigold
material. One key light sweeps along the spine.

Timeline (900ms hard cap): 0–260 rotate 0.6 turn with the specular sweep · 260–420 settle to flat, orthographic ·
420–520 hold · 520–780 saffron fabric wipe pulls upward with a 5% soft fold-gradient edge · 780–900 reveal.
First visit only (`sessionStorage`). Skips instantly on `low`. Poster: the approved 2D stroke-draw loader.

## 02 · Hero cloth

A `PlaneGeometry(6, 4, 24, 24)` under a verlet cloth solver (2 constraint iterations, gravity .0012, wind noise
.0004). Pinned along the top edge only.

Silk shader: Blinn anisotropic sheen with tangent along the weft, `sheenColor` = saree hue lightened 18%,
`sheenRoughness` .28; zari threads drawn from a mask texture get metalness 1.0 / roughness .18 so they read
sharper than the ground. One HDRI-lite env (procedural gradient, no HDR download) plus a rim light.

Behaviour: falls from 1.2 units above frame on mount, settles in ~1.4s, then pointer influence pushes the
lower-left region (max 0.15 units, 400ms smoothing). Headline overlays with `mix-blend-mode: normal` — never
over the fold line. Poster: hero still + the existing 8s video, no annotation text.

## 03 · Colour dye

The same mesh persists across `/colour/[slug]` navigations. On selection, lerp `baseColor`, `sheenColor` and
the ground CSS variable over 800ms. Zari mask colour never changes — that is what sells it as dye taking to
cloth. Zero additional network cost between colours. Poster: the approved CSS page dye.

## 04 · PDP drape + macro loupe

One shared GLB torso/stand form (≤400 KB, no character detail — an abstract mannequin), per-saree 2K texture set
(albedo + zari mask + normal). Orbit clamped ±40° azimuth, ±12° polar, no zoom, damping .08.

Loupe: a second `WebGLRenderTarget` (512²) rendering the same scene with a 3× narrower FOV camera aimed at the
raycast hit point, drawn into a 250px circle with a 2px marigold edge and 220ms follow lag. Mobile: tap-and-hold
instead of hover. Hero flat-lay stays a plain `<img>` — the 3D loads on intersection, below it.

## 05 · Pallu unroll

A rolled saree: a plane bent around a cylinder via a vertex shader driven by one uniform `uUnroll` (0→1).
GSAP ScrollTrigger pins 120vh maximum and maps scroll to `uUnroll`; marigold annotations (body → 4-inch border →
mangai pallu) fade in at 0.25 / 0.55 / 0.85. Desktop `high` only, dynamically imported.
Mobile and mid: the approved 2D horizontal strip with staggered stills.

## 06 · Add-to-bag flight + zari stepper

Flight: FLIP-measure the card image, spawn a 2-fold plane in the shared canvas at that screen rect, fold on two
axes while arcing along a quadratic to the bag icon (720ms), then the bag pulses once in marigold. If no canvas
exists (`low`), a CSS transform flight of the same duration.

Stepper: SVG, not 3D. Each newly completed segment draws warp-then-weft over 900ms using the two-tone weave
`repeating-linear-gradient(90deg, #F5A623 0 7px, #F8CE5A 7px 14px)`; `lastSeenStatus` in localStorage so it
animates once, on the visit where the status changed.

## Page transitions (2D, keep)

780ms saffron panel sweep with the soft fold edge, `View Transitions` API where supported, Framer Motion
fallback. The outgoing route's canvas is not destroyed — it is handed to the incoming route.

## QA checklist per moment

- Poster renders with JS disabled.
- No layout shift when the scene replaces the poster (identical box).
- Scene disposes geometries, materials and render targets on unmount; no context leak across 20 navigations.
- Measured on a mid-range Android (throttled 4× CPU): LCP < 2.5s, no long task > 200ms after mount.
- Reduced-motion: no canvas at all.
