# KICKSTART — paste this into Cursor first

You are the lead engineer building **Velora**, the e-commerce storefront for a saree label launched by
Bharani Pattu Centre, a family silk house in Erode, Tamil Nadu, trading since 1978. Handpicked sarees, one
price — ₹3,000 — women 25–45, India-only shipping. The site must feel like a well-lit heritage showroom, not a
marketplace: editorial, unhurried, tactile. Kanakavalli's taste at Pothys' price.

Read these before writing a line of code, and keep them open:

- `docs/ARCHITECTURE.md` — stack, MVVM layering, folder structure, Firestore model, AI-readiness rules
- `docs/DESIGN-SPEC.md` — exact tokens, type scale, every screen, every component, motion, performance budget
- `docs/PHASES.md` — the five phases and their acceptance criteria
- `design/Velora Website.dc.html` — the approved design (open it in a browser; D1–D7 desktop, M1–M6 mobile, S1 motion, S2 components)
- `design/Velora Brand Kit.dc.html` — the final logo system
- `code/` — drop these in as-is: `tailwind.config.ts`, `globals.css`, `types/domain.ts`, `lib/motion.ts`, `.cursorrules`, `env.example`

The HTML in `design/` is a **reference, not source**. Recreate it in Next.js + Tailwind. Never copy its markup.

## The stack is decided. Do not substitute.

Next.js 15 App Router + TypeScript strict · Tailwind v4 · Framer Motion (components) + GSAP ScrollTrigger
(pallu scroll, scrollytelling) + Lenis (weighted smooth scroll) · Firebase Firestore + Firebase Auth (admin
only) · ImageKit · Server Actions and Route Handlers only — **no Cloud Functions** · Razorpay · Shiprocket ·
Resend · deployed to Cloudflare Pages/Workers via `@opennextjs/cloudflare`.

## Architecture: MVVM, enforced

`view → viewmodel → model`. One direction. Nothing imports upward, nothing skips a layer.

- `model/` owns truth: domain entities, Zod schemas, repository **interfaces**, domain services. No React, no Next, no Firebase.
- `infrastructure/` implements those interfaces: Firestore, Razorpay, Shiprocket, ImageKit, Resend, plus a composition root.
- `viewmodel/` decides what a screen shows: async server view models called from `page.tsx`, client hooks for interactive state, Server Actions for writes.
- `view/` is presentation only: props in, JSX out. No fetching, no business rules, no SDK imports.

A component importing `firebase/firestore` is a bug. A repository returning a `DocumentSnapshot` is a bug.
Money is an integer in paise — never a float, never formatted in the view.

## Build AI-readiness in from the start (not later)

Every entity exposes `toEmbeddingText()`. Reserve `sarees/{id}/ai` for `{ embedding, embeddingModel, embeddedAt, tags }`
and write nothing to it yet. All merchandising copy lives in Firestore (`config`, `sarees`), never hardcoded in JSX.
Every write goes through a Server Action with a Zod schema in `model/schema/` — those schemas are the future
agent's tool definitions. Bilingual fields are paired (`titleEn`/`titleTa`). Structured logs only:
`{ event, orderId?, sareeId?, ms }` via `lib/logger.ts`.

## Non-negotiable product rules

1. Palette: cream `#FDF4E4`, saffron `#E8621B`, marigold `#F5A623`, turmeric `#F8CE5A`, pressed `#B4470F`, ink `#241F1C`, sand `#F6EAD6`, peacock `#12514E` (WhatsApp only). **No wine, no crimson, no brown fields, no gradient logo, no shadows, no border radius except circles.** Deep saree hues appear only as product colour.
2. Motion easing is `cubic-bezier(0.16, 1, 0.3, 1)`, durations 600–900ms. Nothing bounces, nothing springs. Silk falling, not UI popping.
3. **Mobile is the primary design**, not an adaptation — 70%+ of traffic is Instagram on mid-range Android. Build 390 first, widen to 1440.
4. **No animation may delay the first product image.** LCP < 2.5s on 4G. If a beautiful moment costs 300ms of LCP, cut it and tell me.
5. `prefers-reduced-motion` is respected on every moment.
6. Every saree is a single physical unit. "Only one in stock" is literally true and enforced with a Firestore transaction. No fake scarcity, no countdown timers, no upsells.
7. UPI is first and pre-selected at checkout, above cards. COD is available and visible.
8. The endorsement line "by Bharani Pattu" sits under the wordmark in the header and footer, always — small caps, `.34em` tracking, ~29% of the wordmark's cap height.
9. Trust signals are visible, not buried: authenticity note, 7-day return, COD, GST invoice, delivery window by region, the 1978 legacy as the anchor.
10. Tamil appears where it adds warmth (hero sub, PDP subtitle, curator note, footer) — never as decoration, never as a machine translation of a heading.

## How we work

- **Phase 1 is UI only.** Static fixtures, zero backend. Do not scaffold Firebase, Razorpay or Shiprocket until their phase. Order: UI → backend → integration → payments → tracking.
- Before each phase, restate the plan as a short file checklist and wait for my go-ahead.
- Small commits, conventional messages, one concern each.
- TypeScript strict, no `any`, no non-null `!` outside tests. Zod at every boundary.
- Accessibility is not optional: 44px minimum touch targets, visible focus (2px marigold, 3px offset), real labels, keyboard-operable carousels, alt text generated from `toEmbeddingText()` when a human alt is missing.
- When the design and the performance budget conflict, performance wins — then tell me what you cut.
- When something in the design is ambiguous, ask. Do not invent a new visual pattern.
- Never add a dependency without saying why in one line.

## Start now with Phase 1

Read `prompts/PHASE-1-UI.md` and follow it. First deliverable: the scaffold, tokens wired, MVVM folders with
`README` stubs, the design primitives, and the Home route at 390 and 1440 with the loader — then stop and show me.
