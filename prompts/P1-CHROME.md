# P1 — Chrome and content system

Rebuild the 2D site to match `design/Velora Website v2.dc.html` exactly, and get every string out of JSX.
No 3D in this phase — that is P2. Tokens and geometry come from `docs/BRAND.md`.

## 1. Tokens

Put the palette, type scale, tracking, spacing and motion constants into `tailwind.config.ts` +
`globals.css` (see `code/globals.css` and `code/tailwind.config.ts` in this bundle — drop them in and adapt).
After this, **no component contains a hex value**. Radius 0 everywhere except circles; no shadows.

## 2. Primitives and components

`Button` (primary saffron / secondary outline / whatsapp peacock outline / disabled; 48px desktop, 56px mobile;
hover → pressed 220ms; focus 2px marigold outline offset 3px), `Field` (rest / focus saffron / autofilled sand /
error pressed + 11px note), `Swatch` (72 rest, 78 hover, 78 + double ring selected, 28% sold-out, 44px touch),
`Rule` (marigold hairline gradient, draws from left 900ms on enter), `Price` (paise → ₹, never a float),
`Badge`, `SectionHead`, `TamilText`.

`SareeCard` (3/4, drape badge, flat-lay → draped cross-fade 600ms; hover on desktop, IntersectionObserver on
mobile), `ColourWheel`, `SpecTable`, `AuthenticityPanel`, `TrustRow`, `CuratorBand`, `OccasionRow`,
`OccasionGrid`, `InstagramGrid`, `LegacyStrip`, `ZariStepper`, `RelatedSarees`.

Layout: `Header`, `MobileNav`, `Footer`, `StickyBuyBar`, `WhatsAppFab`, `ScrollThread`.

Two defects to get right, both found in design review:

1. Header — `gap: 36px` on the row and `flex-shrink: 0; white-space: nowrap` on both nav clusters. The
   letterspaced wordmark overruns its box and will collide with the nav otherwise.
2. Mobile — the scrolling column reserves `padding-bottom: 96px` for the sticky buy bar, and any block sitting
   under the WhatsApp FAB reserves `padding-right: 60px`. Verify explicitly at 390×844.

## 3. Content out of JSX

Every merchandising string — occasion names and descriptions, colour labels (EN + TA), trust copy, delivery
windows by region, curator quote, Our Story panels, empty-state copy — moves to Firestore `config` (or a typed
`content/` module if Firestore is not yet wired). Components receive text as props.

Empty states are written in the brand voice: "Nothing in maroon this month — the next edit lands in early
September", never "0 results".

## 4. Screens

Rebuild all seven routes at 390 and 1440 from the reference: Home, Shop by Colour, Shop by Occasion, PDP,
Our Story (approved copy), Bag/Checkout, Tracking. Mobile first, then widen.

2D motion now: Lenis smooth scroll, 780ms saffron page-transition wipe with the soft fold edge, `Reveal`
stagger on mobile sections, `Rule` draw-in, 600ms card cross-fade, scroll thread fill.
Every value from `lib/motion.ts`. Every moment has a reduced-motion branch.

## Acceptance

- Side-by-side match with the reference at 390 and 1440 for all seven routes.
- Lighthouse mobile ≥ 95 performance on `/` and a PDP; CLS < 0.05.
- No hex values, no hardcoded copy, no `'use client'` above a `view/` leaf.
- 390×844: no overlap of the sticky bar or FAB with any content (this is a regression test — screenshot it).
- Reduced motion: no wipe, no draw, no autoplaying loops.
