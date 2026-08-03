# Architecture

## Stack (fixed — do not substitute)

| Layer | Pick |
| --- | --- |
| Framework | Next.js 15, App Router, TypeScript strict |
| Styling | Tailwind CSS v4 (tokens in `code/globals.css` + `code/tailwind.config.ts`) |
| Motion | Framer Motion (components), GSAP + ScrollTrigger (pallu scroll, scrollytelling), Lenis (weighted smooth scroll) |
| Hosting | Cloudflare Pages / Workers (`@opennextjs/cloudflare`) |
| Data | Firebase Firestore (+ Firebase Auth for admin only) |
| Images | ImageKit (transforms + India CDN edges) |
| Server logic | Next.js Server Actions and Route Handlers — no Cloud Functions |
| Payments | Razorpay (UPI-first) |
| Shipping | Shiprocket (AWB + tracking) |
| Email | Resend |

Firestore is a document store, so **all relational integrity lives in the repository layer** (see below):
denormalise deliberately, validate with Zod at every boundary, never let a component touch the Firestore SDK.

## MVVM, mapped onto the App Router

The rule: **View is dumb, ViewModel decides, Model owns truth.** One direction of dependency —
`view → viewmodel → model`. Nothing imports upward, nothing skips a layer.

```
src/
  model/                        ← MODEL: truth. No React, no Next imports.
    domain/                     entities + value objects (Saree, Order, Address, Money, Colour, Occasion)
      saree.ts                  type + invariants + factory
      order.ts
      money.ts                  paise-based Money; never use floats for ₹
    schema/                     Zod schemas — the single source of runtime validation
    repository/                 interfaces ONLY (SareeRepository, OrderRepository, TrackingRepository)
    service/                    domain logic independent of transport (pricing, availability, order state machine)
  infrastructure/               ← adapters that implement model/repository interfaces
    firebase/                   admin + client SDK init, converters, FirestoreSareeRepository, FirestoreOrderRepository
    razorpay/                   RazorpayGateway implements PaymentGateway
    shiprocket/                 ShiprocketCarrier implements Carrier
    imagekit/                   url builder, srcset helpers
    resend/                     transactional email sender
    container.ts                composition root: builds concrete repos, exports typed getters
  viewmodel/                    ← VIEWMODEL: shapes model data for the view, holds UI state
    server/                     server-side view models (async, called from page.tsx)
      home.viewmodel.ts         getHomeViewModel(): HomeVM
      collection.viewmodel.ts   colour + occasion listing
      product.viewmodel.ts
      order.viewmodel.ts        cart, checkout, tracking
    client/                     client-side view models = hooks, one per interactive surface
      useCart.ts                bag state (localStorage-backed, server-verified on checkout)
      useColourDye.ts           selected colour + page dye orchestration
      useLoupe.ts               PDP macro zoom pointer state
      useAddToBagFlight.ts      fold-and-fly animation state
    actions/                    Server Actions: 'use server' — validate → service → repository → revalidate
      createOrder.ts
      verifyPayment.ts
      upsertSaree.ts            (admin)
  view/                         ← VIEW: presentation only. Props in, JSX out. No fetching, no business rules.
    primitives/                 Button, Field, Swatch, Rule, Badge, Price
    components/                 SareeCard, ColourWheel, SpecTable, TrustRow, ZariStepper, PalluScroll, Loupe
    layout/                     Header, MobileNav, Footer, StickyBuyBar, WhatsAppFab, ScrollThread
    motion/                     PageTransition, FabricWipe, VelLoader, Reveal
  app/                          ← thin routing shell: page.tsx calls a server view model and renders a view
    (store)/page.tsx            Home
    (store)/colour/[slug]/page.tsx
    (store)/occasion/[slug]/page.tsx
    (store)/saree/[slug]/page.tsx
    (store)/story/page.tsx
    (store)/bag/page.tsx
    (store)/checkout/page.tsx
    (store)/track/[orderId]/page.tsx
    admin/                      mobile-first PWA (Phase 2)
    api/razorpay/webhook/route.ts
    api/shiprocket/webhook/route.ts
  lib/                          cross-cutting, framework-level only: motion constants, cn(), formatters, logger
```

### What goes where — a test you can apply

* Does it know about ₹, stock rules, or order states? → `model/`
* Does it know about Firestore, Razorpay, HTTP? → `infrastructure/`
* Does it decide *what* the screen shows, or hold UI state? → `viewmodel/`
* Does it decide *how* something looks? → `view/`

A component that imports `firebase/firestore` is a bug. A view model that returns a Firestore
`DocumentSnapshot` is a bug. Repositories return **domain objects**, never raw documents.

### Server vs client components

Default to server components. A component becomes `'use client'` only when it needs pointer events,
animation state, or local UI state — i.e. only inside `view/` leaves and `viewmodel/client/`.
Keep the client bundle small enough that the PDP hero image is never behind JS.

## Data model (Firestore)

```
sarees/{sareeId}
  slug, titleEn, titleTa, priceInPaise (300000), status: 'available' | 'reserved' | 'sold',
  colour: { key: 'maroon', labelEn, labelTa, hex }, occasions: ['muhurtham','reception'],
  fabric, lengthCm, blousePieceCm, zari, care, weightGrams,
  images: [{ id, alt, aspect, order }], drapeVideo: { id, posterId, durationMs },
  authenticityNote, curatorNote, publishedAt, createdAt, updatedAt
orders/{orderId}                       # VLR-4821 style human id in `reference`
  reference, status: 'pending'|'paid'|'packed'|'shipped'|'out_for_delivery'|'delivered'|'cancelled'|'refunded',
  items: [{ sareeId, slug, titleEn, priceInPaise, imageId }],   # denormalised snapshot at purchase
  totals: { subtotalInPaise, shippingInPaise, totalInPaise },
  customer: { name, phone, email? },
  address: { line1, line2?, landmark?, pincode, city, state },
  payment: { method: 'upi'|'cod'|'card'|'netbanking', provider: 'razorpay',
             razorpayOrderId?, razorpayPaymentId?, verifiedAt? },
  shipment: { provider: 'shiprocket', awb?, courier?, trackingUrl?, expectedAt? },
  timeline: [{ status, at, note? }],    # drives the zari stepper — append-only
  createdAt, updatedAt
inventoryLocks/{sareeId}               # single-unit reservation, TTL 15 min, written in a transaction
config/{singleton}                     # shipping copy, delivery windows by region, occasion + colour taxonomy
```

Rules of engagement:

* Every saree is **one physical unit**. Adding to bag creates an `inventoryLocks` doc in a transaction; a
  second buyer sees "Sold" immediately. Locks expire after 15 minutes.
* `priceInPaise` is an integer. Never store rupees as a float, never do arithmetic in the view.
* `timeline` is append-only and is the only source for tracking UI — never derive status from a webhook payload directly.
* Firestore security rules: public read on `sarees` where `status != 'draft'`; everything else server-only.
  Orders are never client-readable; tracking is fetched by server action against `reference` + phone last 4.

## AI-readiness (build this in from day one, do not retrofit)

The point is that a future agent can answer questions about sarees, draft copy, and help customers on WhatsApp
without you rewriting the data layer.

1. **Every domain entity has a stable `id` and a `toEmbeddingText()` method** in `model/domain/`. It returns a
   plain-language description ("Maroon pure mulberry silk saree, half-fine zari 4 inch border, mangai motif
   pallu, 6.3 m with attached blouse piece, dry clean only, ₹3,000") — one function, used by search, by the
   sitemap, by alt-text fallbacks, and later by embeddings.
2. **`sarees/{id}/ai` subdoc** reserved for `{ embedding: number[], embeddingModel, embeddedAt, tags: string[] }`.
   Write nothing to it in Phase 1–5; the shape is fixed so nothing migrates later.
3. **All content in Firestore, never in JSX.** Curator notes, occasion descriptions, trust copy, delivery
   windows live in `config` and `sarees`. An agent can then edit merchandising without touching code.
4. **Every write goes through a Server Action with a Zod schema.** Those schemas double as the tool
   definitions for a future agent — one file, both purposes. Keep them in `model/schema/`.
5. **Bilingual fields are paired (`titleEn` / `titleTa`)** so translation can be automated per field, never
   as a whole-page blob.
6. **Structured logging** (`lib/logger.ts`) with `{ event, orderId?, sareeId?, ms }`. No `console.log` in
   `infrastructure/`. This is what an agent reads when something breaks.
7. **`docs/` in the repo mirrors this bundle** and is kept current; `.cursorrules` points at it.

## Environment

See `code/env.example`. Secrets never reach the client: only `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`,
`NEXT_PUBLIC_RAZORPAY_KEY_ID` and the Firebase web config are public.
Razorpay webhook secret, Firebase admin credentials, Shiprocket and Resend keys are server-only,
bound as Cloudflare secrets.
