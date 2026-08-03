# Velora — developer handoff

Everything needed to build the Velora storefront (velora.in) from the approved design.
Read this file first, then `prompts/00-KICKSTART.md`.

## What Velora is

A saree label launched by **Bharani Pattu Centre**, a family silk house in Erode, Tamil Nadu, trading since 1978.
Handpicked sarees, single price point **₹3,000**, women 25–45, India-only shipping.
Positioning: Kanakavalli's taste at Pothys' price. Editorial, unhurried, tactile — a well-lit heritage showroom, not a marketplace.

Endorsement line **"by Bharani Pattu"** appears under the logo in the header and the footer. Always.

## What is in this bundle

```
README.md                  ← you are here
docs/ARCHITECTURE.md       stack, MVVM layering, folder structure, data model, integrations, AI-readiness
docs/DESIGN-SPEC.md        exact tokens, type scale, every screen, every component, motion + perf budget
docs/PHASES.md             the five delivery phases and their acceptance criteria
prompts/00-KICKSTART.md    paste this into Cursor first — project constitution
prompts/PHASE-1-UI.md      … through PHASE-5-TRACKING.md, one prompt per phase, in order
code/                      drop-in config: tailwind tokens, globals.css, domain types, motion constants,
                           .cursorrules, package.json dependency list, env.example
design/                    the approved designs as HTML (open in a browser)
assets/                    logo kit: SVG, PNG, favicons, Instagram avatar, brand tokens
```

## About the design files

`design/*.dc.html` are **design references built in HTML** — they show the intended look, layout, copy and motion.
They are **not** production code and must not be copied into the app. Recreate them in Next.js + Tailwind
using the patterns in `docs/ARCHITECTURE.md`.

Open them by double-clicking; `support.js` must stay next to them.

| File | Contains |
| --- | --- |
| `design/Velora Website.dc.html` | Desktop D1–D7 (Home, Shop by Colour, Shop by Occasion, PDP, Our Story, Cart/Checkout, Tracking), Mobile M1–M6, loader/transition frames, component sheet |
| `design/Velora Brand Kit.dc.html` | Final logo system, lockups, favicon proofs, hangtag, Instagram, web header/product-card treatment |
| `design/Velora Identity.dc.html` | Identity exploration that led to the final mark — background only, do not build from it |

## Fidelity

**High fidelity.** Colours, type sizes, tracking, spacing and copy in the design files are final and should be
matched. Where the design shows a striped placeholder with a monospace label ("saree product shot",
"3s drape loop", "hero video"), that is real content the client will supply — build the component, use a
placeholder image of the same aspect ratio meanwhile.

## Non-negotiables

1. Palette is cream / saffron / marigold / turmeric / ink. **No wine, no crimson, no brown fields, no gradients on the logo.**
   Deep saree hues (maroon, peacock, indigo, plum, leaf) appear **only** as product colour on Shop by Colour.
2. Motion easing is `cubic-bezier(0.16, 1, 0.3, 1)`, durations 600–900ms. Nothing bounces, nothing springs.
3. **Mobile is the primary design.** 70%+ of traffic is Instagram on mid-range Android.
4. No animation may delay the first product image. LCP < 2.5s on 4G, or the moment gets cut.
5. `prefers-reduced-motion` is respected everywhere.
6. No upsells, no countdown timers, no fake scarcity. "Only one in stock" is true — every saree is a single unit.
7. UPI is the first and default payment method, above cards.

## Build order (do not reorder)

1. **Phase 1 — UI.** Every screen, static data, all motion. No backend.
2. **Phase 2 — Backend.** Firestore data layer, repositories, server actions, admin PWA.
3. **Phase 3 — Integration.** Wire the UI to real data; ImageKit; Resend; SEO.
4. **Phase 4 — Payments.** Razorpay UPI-first, webhook verification, order creation.
5. **Phase 5 — Order tracking.** Shiprocket AWB, status sync, zari-thread stepper on real data.

Business sequence, in parallel with the build: Instagram + WhatsApp Business catalogue go live **before** the
website. The site is the credibility layer that converts reel traffic, not the thing sales depend on.
