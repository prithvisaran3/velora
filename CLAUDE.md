# CLAUDE.md — Velora

You are revamping an **existing, deployed** Next.js storefront: `github.com/prithvisaran3/velora`,
live at `velora-saree.vercel.app`. This is a redesign of a running site, not a greenfield build.

Read in this order: this file → `docs/BRAND.md` → `docs/3D-MOTION.md` → `docs/REVAMP-PLAN.md` →
`prompts/P0…P4`. The design reference is `design/Velora Website v2.dc.html` (open in a browser).
`design/*.dc.html` are **HTML design references, not source** — never copy their markup.

## The brand, in one paragraph

Velora sells handpicked sarees from Erode, Tamil Nadu, curated by **Priya Mahadevan**, who learned silk from
her father Mahadevan behind his counter from 1977. The endorsement line under the wordmark is
**"by Priya Mahadevan"** — in the **footer and the mobile drawer**, always. It is deliberately *not* in the
header: the v9 nav is VelMark + ELORA on one baseline, so the nav can sit on the hero's thread ground
without becoming a two-line block. (Superseded the older "header and footer, always" rule — v9 takeover.)

## Hard rules

1. **The words "Bharani Pattu" must not appear anywhere** — not in copy, metadata, alt text, JSON-LD, commit
   messages, seed data, or the repo. Same for "since 1978" and the old curator name "Lakshmi". Grep before you commit.
2. Palette is fixed by the approved **Thread v9** direction: cream `#EDE2CE` (ground) · panel `#FBF6EC` ·
   sand `#F7F0E3` · dune `#E7DAC2` · saffron `#C6521A` · pressed `#8E3410` · marigold `#F5A623` ·
   turmeric `#F8CE5A` · ink `#241F1C` · peacock `#12514E` (WhatsApp only). The thread is `#C9901E` base,
   `#FFDD8E` lit, `#FFF3D2` specular. Saree hues (maroon/peacock/indigo/leaf/plum/kora) are product data,
   never chrome. No new colours. Every value lives in `globals.css` under `@theme` — never inline a hex.
3. **The logo V is a full capital.** viewBox `0 0 120 100`, ink fills the box, sized so ink height == the
   wordmark's cap height (0.75 × font-size), aligned with `align-items:baseline`. Geometry in `docs/BRAND.md`.
4. **No developer annotation may ever render.** The live site currently ships "hero video · 8s silent loop",
   "background-color 800ms cubic-bezier(.16,1,.3,1)", "prefers-reduced-motion → instant swap" and
   "curator portrait · shop interior" as customer-facing text. Deleting those is task one.
5. Motion easing `cubic-bezier(0.16, 1, 0.3, 1)`, durations 600–900ms. Nothing bounces or springs.
6. **No 3D scene may delay the first product image.** One WebGL context for the whole site, created after LCP.
   Every scene has a poster twin. LCP < 2.5s on 4G mid-range Android or the moment gets cut. v9 leaves two
   scenes standing — the cone wall and the bag flight. **The saree is never animated: it is only ever a still
   photograph.** Do not reintroduce a cloth simulation, a drape orbit or a scroll-driven unroll.
7. `prefers-reduced-motion` collapses every 3D moment to its poster.
7b. **The thread is the design system.** Loading, filtering, checkout progress, order tracking, underlines,
   dividers, page transitions and card frames are all one SVG thread reading `--thread` / `--thread-lit`.
   It never learns how many sarees there are. See `src/view/thread/`.
8. Mobile is the primary design (70%+ of traffic is Instagram on Android). Build 390 first.
9. One price or an honest range — pick one and be consistent. The live site mixes ₹2,450–₹4,800 with
   "all ₹3,000" copy. Ask the owner if unclear; do not invent.
9b. **Count-agnostic, always.** No "48 sarees a month", no "twelve pieces", no month name, no edit counter —
   in copy, headings, filters or metadata. Nothing may break when she adds stock. "All sarees", never
   "Twelve sarees". Filters and LOAD MORE do the narrowing a curated count used to imply.
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
