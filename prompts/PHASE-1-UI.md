# Phase 1 — UI only

No Firebase, no Razorpay, no Shiprocket, no network calls. Static fixtures only.
Reference `docs/DESIGN-SPEC.md` for every measurement and `design/Velora Website.dc.html` for every frame.

## 1. Scaffold

`create-next-app` (App Router, TypeScript strict, Tailwind v4, ESLint, no src alias surprises — use `src/`).
Add: `framer-motion`, `gsap`, `lenis`, `zod`, `clsx`, `tailwind-merge`. Nothing else yet.

Drop in from `code/`: `tailwind.config.ts`, `globals.css` (tokens + font faces), `types/domain.ts` →
`src/model/domain/types.ts`, `lib/motion.ts`, `.cursorrules` at repo root, `env.example`.

Create the MVVM folders exactly as in `docs/ARCHITECTURE.md`, each with a one-paragraph `README.md` stating
what may and may not live there. Add an ESLint boundary rule: `view/**` must not import `infrastructure/**` or
`firebase/*`; `model/**` must not import `react`, `next/*` or anything in `infrastructure/**`.

Fonts: Bodoni Moda, Archivo, Anek Tamil via `next/font/google`, subset latin + tamil, `display: swap`.
Copy `assets/` into `public/brand/`.

## 2. Fixtures

`src/model/fixtures/sarees.ts` — 24 sarees with realistic Tamil/English titles, colours spread across maroon,
peacock, indigo, leaf, plum, kora, saffron, marigold, occasions across the six moments, `priceInPaise: 300000`,
fabric/length/blouse/zari/care/weight, 3–4 images each (use `/placeholder/*.jpg` at 3/4), one drape video slot,
authenticity note. Two sarees marked `sold`. Plus `config.fixture.ts` for occasion copy, colour taxonomy,
delivery windows and trust copy — **all UI text comes from there, not from JSX**.

Each fixture goes through the real domain factory so Phase 3 can swap the source with no view changes.

## 3. Primitives (`view/primitives`)

`Button` (primary / secondary / whatsapp / disabled, 48px desktop 56px mobile, hover → `pressed` 220ms, focus ring),
`Field` (rest / focus / autofilled / error with note), `Swatch` (rest / hover / selected double-ring / sold-out),
`Rule` (marigold hairline gradient, draws on enter), `Price` (formats paise, never floats),
`Badge`, `Label`, `SectionHead`, `TamilText`.

## 4. Components (`view/components`)

`SareeCard` (3/4, drape-loop badge, cross-fade flat-lay → draped 600ms; hover desktop, IntersectionObserver on
mobile), `ColourWheel`, `SpecTable`, `AuthenticityPanel`, `TrustRow`, `CuratorBand`, `OccasionRow`,
`OccasionGrid`, `InstagramGrid`, `LegacyStrip`, `ZariStepper`, `Loupe`, `PalluScroll` (GSAP, desktop-only,
dynamically imported), `RelatedSarees`.

## 5. Layout + motion

`Header` (desktop nav/logo/utilities with `gap:36px`, `flex-shrink:0`, `white-space:nowrap` on the nav clusters —
the letterspaced wordmark overruns otherwise), `MobileNav`, `Footer`, `StickyBuyBar` (mobile; the scrolling
column above reserves 96px bottom padding), `WhatsAppFab` (52px peacock circle; any block it overlaps reserves a
60px right gutter), `ScrollThread`.

`view/motion`: `VelLoader` (the five loader beats from S1, ≤900ms total, stroke-dashoffset then fill then the
saffron fabric wipe with a 5% soft fold edge), `PageTransition` (780ms saffron sweep with fold edge),
`FabricWipe`, `Reveal` (staggered enter for mobile sections), `AddToBagFlight` (720ms two-axis fold into the bag
icon, bag pulses once in marigold).

Wire Lenis at the root. Every motion value comes from `lib/motion.ts` — no inline durations or easings.
Every moment has a reduced-motion branch per `docs/DESIGN-SPEC.md` §6.

## 6. Routes

`/` · `/colour/[slug]` (with the 800ms page dye — animate a CSS variable on `<html>`, recompute text contrast,
do not animate text colour) · `/occasion/[slug]` · `/saree/[slug]` · `/story` · `/bag` · `/checkout` (form UI +
validation only, PIN → city/state from a local fixture map) · `/track/[reference]` (stepper on fixture data).

Each `page.tsx` is thin: call `viewmodel/server/*.viewmodel.ts`, pass a typed VM into one view component.

## 7. Client state

`useCart` (localStorage, single-unit rules, no server yet), `useColourDye`, `useLoupe`, `useAddToBagFlight`,
`useReducedMotion`, `useInViewOnce`.

## Acceptance

- Every D1–D7 and M1–M6 frame reproducible at 1440 and 390; the component sheet S2 matches state for state.
- Lighthouse mobile ≥ 95 performance on `/` and `/saree/[slug]`; hero poster is a real `<img fetchpriority="high">`; no video before LCP.
- Reduced-motion: no wipe, no dye animation, no autoplaying loops.
- No `'use client'` above a `view/` leaf. No business rules in `view/`. No hardcoded UI copy.
- Zero console errors, zero layout shift on the sticky bar and FAB (they were the two defects found in review — check them explicitly at 390×844).

Stop after this phase and show me `/`, `/saree/[slug]` and `/checkout` at both widths.
