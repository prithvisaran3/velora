# P3 — Content and commerce truth · P4 — Tracking and hardening

Two phases in one file; ship them as two PRs.

---

# P3 · Content and commerce truth

## Images and video (ImageKit)

All product media through ImageKit: `srcset` at 390/540/768/1080/1440/1920, `sizes` per component
(`SareeCard` 50vw mobile / 25vw desktop; PDP hero `min(840px,100vw)`), format auto, quality 78 grids / 85 hero,
blur LQIP placeholders. Drape clips: 3s, ≤400 KB, `muted playsinline preload="none"`, mounted within one
viewport. Each saree also needs a **2K weave crop** — it feeds both the loupe and the 3D texture from P2.
Admin uploads are signed server-side; the private key never reaches the client.

## Single-unit truth

Every saree is one physical unit. `reserve(sareeId, cartId)` runs in a Firestore transaction: fail if not
available, write `inventoryLocks/{sareeId}` with a 15-minute `expiresAt`, set the saree to `reserved`.
A cron sweep releases stale locks and cancels the abandoned order. Two concurrent adds — exactly one wins, the
loser sees "Just sold" in the brand voice. "Only one in stock" must never be decorative.

## Checkout

Single column, no upsells, no timers. Address form for India: name, mobile, street, then PIN which fills city
and state on blur (both stay editable). Payment order is **UPI first and pre-selected**, then COD (gated by
`config.codPincodePrefixes`, disabled with a one-line reason where unavailable), then card/netbanking.
Totals in paise, recomputed server-side; never trust a client total.

Razorpay: server-created order, Checkout script only on `/checkout` (`lazyOnload`), signature verified
server-side with `timingSafeEqual` on the raw body, webhook idempotent by event id, and exactly one
`settlePayment()` that can mark an order paid. A payment that succeeds while the tab closes still lands.

## Email and SEO

Resend confirmation: reference, saree, amount, method, address, delivery window by region, GST note, WhatsApp
link. Template copy lives in `config`.

SEO: per-route metadata from real data; `Product` (+`Offer` INR, availability), `Organization` (**Velora**,
founder Priya Mahadevan, Erode — no old house name), `BreadcrumbList`, `WebSite` + `SearchAction`; sitemap and
robots generated from the repository; OG images via `next/og` on brand. Alt text from the product, never empty.

**Done when:** a real order can be placed and paid on live keys with a ₹1 unpublished test SKU, the confirmation
arrives, Rich Results validates, and no image on a mobile grid exceeds 200 KB.

---

# P4 · Tracking, hardening, handover

## Shiprocket

On paid (or COD confirmed): authenticate (token cached), create order, request AWB and pickup; store
`shipment: { awb, courier, trackingUrl, expectedAt }`. Failures never block the customer — retry with backoff and
surface "Needs AWB" in `/admin`.

Webhook → map carrier status onto our five states and append to the **append-only** `timeline`
(de-duplicated by `(status, carrierEventId)`): pickup/in-transit → `shipped`, out for delivery →
`out_for_delivery`, delivered → `delivered`; RTO/cancelled/lost → a note on the current state plus an admin flag;
anything unknown → log and keep the last known state. Add a 3-hourly polling fallback, because carrier webhooks
drop events.

## Tracking page

`/track/[reference]`, no login, **not enumerable**: ask for the last 4 digits of the phone, verify server-side,
rate-limit 5 attempts per 10 minutes per IP, and return nothing in the HTML before verification.
Renders the zari stepper from `timeline` only, plus the order summary and a WhatsApp deep link prefilled with
the reference and saree name.

## Admin PWA (`/admin`) — mobile first

Priya adds products from her phone, standing next to the sarees: camera-roll multi-upload with client-side
compression (max 2000px, ~350 KB, EXIF-rotated), drag to reorder, Tamil labels beside English, colour picker
showing real swatches, occasion chips, and **"duplicate last product"** at the top of the form so fabric, length
and care are never retyped. Orders list: newest first, one tap to advance status through the state machine,
`tel:` and WhatsApp links, address copy button.

## Hardening

Error and empty states in the brand voice. Structured logs `{ event, orderId?, sareeId?, ms }` — no PII, no card
data, no VPA. Firestore rules: public read on published sarees and `config`; `orders`, `inventoryLocks` and
`sarees/{id}/ai` deny all client access. Update the README to describe what actually shipped.

**Done when:** an order goes placed → delivered with each new zari segment drawing once, tracking cannot be
enumerated, and Priya can publish a saree from her phone in under 90 seconds.
