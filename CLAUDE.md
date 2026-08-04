# CLAUDE.md — Velora

You are revamping an **existing, deployed** Next.js storefront: `github.com/prithvisaran3/velora`,
live at `velora-saree.vercel.app`. This is a redesign of a running site, not a greenfield build.

Read in this order: this file → `docs/BRAND.md` → `docs/3D-MOTION.md` → `docs/REVAMP-PLAN.md` →
`prompts/P0…P4`. The design reference is `design/Velora Website v2.dc.html` (open in a browser).
`design/*.dc.html` are **HTML design references, not source** — never copy their markup.

## The brand, in one paragraph

Velora sells handpicked sarees from Erode, Tamil Nadu, curated by **Priya Mahadevan**, who learned silk from
her father Mahadevan behind his counter from 1977. The endorsement line under the wordmark is
**"by Priya Mahadevan"** — in the header and the footer, always.

## Hard rules

1. **The words "Bharani Pattu" must not appear anywhere** — not in copy, metadata, alt text, JSON-LD, commit
   messages, seed data, or the repo. Same for "since 1978" and the old curator name "Lakshmi". Grep before you commit.
2. Palette is unchanged from the approved design: cream `#FDF4E4` · saffron `#E8621B` · marigold `#F5A623` ·
   turmeric `#F8CE5A` · pressed `#B4470F` · ink `#241F1C` · sand `#F6EAD6` · peacock `#12514E` (WhatsApp only).
   Saree hues (maroon/peacock/indigo/leaf/plum/kora) are product data, never chrome. No new colours.
3. **The logo V is a full capital.** viewBox `0 0 120 100`, ink fills the box, sized so ink height == the
   wordmark's cap height (0.75 × font-size), aligned with `align-items:baseline`. Geometry in `docs/BRAND.md`.
4. **No developer annotation may ever render.** The live site currently ships "hero video · 8s silent loop",
   "background-color 800ms cubic-bezier(.16,1,.3,1)", "prefers-reduced-motion → instant swap" and
   "curator portrait · shop interior" as customer-facing text. Deleting those is task one.
5. Motion easing `cubic-bezier(0.16, 1, 0.3, 1)`, durations 600–900ms. Nothing bounces or springs.
6. **No 3D scene may delay the first product image.** One WebGL context for the whole site, created after LCP.
   Every scene has a poster twin. LCP < 2.5s on 4G mid-range Android or the moment gets cut.
7. `prefers-reduced-motion` collapses every 3D moment to its poster.
8. Mobile is the primary design (70%+ of traffic is Instagram on Android). Build 390 first.
9. One price or an honest range — pick one and be consistent. The live site mixes ₹2,450–₹4,800 with
   "all ₹3,000" copy. Ask the owner if unclear; do not invent.
10. Trust signals stay visible: authenticity note, 7-day return, COD, GST invoice, delivery window, and
    Priya's lineage as the anchor.

## Architecture

MVVM, one direction: `view → viewmodel → model`.

- `model/` — domain entities, Zod schemas, repository **interfaces**, domain services. No React, Next or Firebase.
- `infrastructure/` — the only place SDKs appear (Firestore, Razorpay, Shiprocket, ImageKit, Resend) + composition root.
- `viewmodel/` — async server view models called by `page.tsx`, client hooks for UI state, Server Actions for writes.
- `view/` — presentation only: props in, JSX out. No fetching, no business rules, no SDK imports.
- `three/` — R3F scenes, shaders, device tiering, the shared canvas provider. Imported only by `view/` leaves, always dynamically.

Bugs by definition: a component importing `firebase/*`; a repository returning a `DocumentSnapshot`; money as a
float (integer paise only); UI copy hardcoded in JSX (it belongs in Firestore `config`); a 3D scene imported statically.

If the existing repo does not match this layout, **migrate incrementally, route by route** — do not stop
feature work for a big-bang refactor, and do not leave two conventions alive in the same route.

## Stack

Next.js 15 App Router · TypeScript strict · Tailwind · Framer Motion + GSAP ScrollTrigger + Lenis ·
**React Three Fiber + drei + three** (new) · Firebase Firestore · ImageKit · Razorpay · Shiprocket · Resend.
Keep the current host (Vercel) unless the owner asks to move. Do not add a dependency without one line of justification.

## Working agreement

- Work through `prompts/P0…P4` in order. One PR per phase, each independently deployable.
- Before each phase: restate the plan as a file checklist and wait for approval.
- After each phase: report measured LCP/CLS on the deployed preview, not localhost.
- Small conventional commits. TypeScript strict, no `any`, no non-null `!` outside tests.
- When the design is ambiguous, ask. Do not invent a new visual pattern or a new colour.
- If a beautiful moment costs 300ms of LCP, cut it and say what you cut.
