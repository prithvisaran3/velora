# Delivery phases

One phase at a time. Do not start the next until the previous one's acceptance criteria pass.
Each phase has a prompt in `prompts/`.

---

## Phase 1 — UI only (`prompts/PHASE-1-UI.md`)

Every screen built from static fixtures. No Firebase, no payments, no network calls.

Scope: project scaffold, tokens, MVVM folders, primitives, components, all seven routes desktop + mobile,
loader, page transitions, colour dye, card cross-fade, loupe, pallu scroll, zari stepper, add-to-bag flight,
scroll thread, dividers, reduced-motion variants, `model/fixtures/sarees.ts` with 24 realistic sarees.

**Done when:** every frame in `design/Velora Website.dc.html` is reproducible at 390 and 1440; Lighthouse
mobile ≥ 95 performance on the Home and PDP routes with fixtures; no `'use client'` above a `view/` leaf;
`viewmodel/server/*` returns typed VMs from fixtures; motion honours reduced-motion; zero console errors.

---

## Phase 2 — Backend (`prompts/PHASE-2-BACKEND.md`)

Firestore schema, repositories implementing `model/repository` interfaces, Zod schemas, order state machine,
single-unit inventory locks in transactions, security rules, seed script, admin PWA at `/admin`.

Admin is **mobile-first**, built for a woman standing next to her sarees: camera-roll upload with client-side
compression, drag to reorder images, Tamil labels beside English, and **"duplicate last product"** so fabric/
length/care are never retyped. Firebase Auth (single admin account), no public sign-up.

**Done when:** seeding 24 sarees works; `SareeRepository` + `OrderRepository` pass unit tests against the
emulator; an order can be created, moved through every status, and rejected on an invalid transition; two
concurrent add-to-bags on one saree — exactly one wins; rules deny all client reads of `orders`;
a product can be created end-to-end from a phone in under 90 seconds.

---

## Phase 3 — Integration (`prompts/PHASE-3-INTEGRATION.md`)

Replace fixtures with repositories. ImageKit URLs + responsive srcsets + blur placeholders. Resend order
confirmation. SEO: metadata per route, `Product` + `Organization` + `BreadcrumbList` JSON-LD, sitemap, robots,
OG images. `revalidateTag` on writes. Cloudflare deploy with secrets bound.

**Done when:** every route renders live Firestore data; images serve from ImageKit with correct `sizes`;
LCP < 2.5s on throttled 4G for Home and PDP; "silk saree Erode" style queries have valid structured data
(Rich Results test passes); a test order sends a confirmation email; deployed on Cloudflare with no secret in the client bundle.

---

## Phase 4 — Payments (`prompts/PHASE-4-PAYMENTS.md`)

Razorpay, UPI first. Server-created Razorpay order, Checkout on the client, **signature verified server-side**
in a Route Handler, idempotent webhook, order transitions `pending → paid`, inventory lock converted to `sold`,
COD path, failure and abandonment handling, invoice/GST note in the confirmation email.

**Done when:** UPI, card and COD all produce a correct order; webhook replay is idempotent; a tampered client
callback is rejected; a payment that succeeds while the user closes the tab still marks the order paid;
amounts reconcile in paise with no float drift; every payment event is logged with `{ event, orderId, ms }`.

---

## Phase 5 — Order tracking (`prompts/PHASE-5-TRACKING.md`)

Shiprocket: create shipment on `paid`, store AWB + courier + expected date, receive status webhooks, append to
`timeline`, map carrier statuses onto the five stepper states, `/track/[reference]` lookup by reference +
phone last 4, WhatsApp deep link with order context, delivery-window copy by region from `config`.

**Done when:** a real AWB appears on the order; carrier webhooks append to `timeline` and the stepper renders
from it; unknown carrier statuses degrade to the last known state rather than breaking; tracking is reachable
without login but not enumerable; the zari thread animates only the newly completed segment (900ms).

---

## Out of scope until asked

Reviews, wishlists, coupons, multi-currency, international shipping, blog, loyalty, multi-admin roles.
Do not add them speculatively — they cost LCP and complexity, and the brand's promise is selection, not features.
