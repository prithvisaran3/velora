# Phase 5 — Order tracking (Shiprocket + the zari stepper)

The stepper is the emotional payoff of the order: a gold zari thread being woven as the saree travels.
It must render from stored truth, never from a live carrier call at request time.

## 1. Shipment creation

On `paid` (or COD `confirmed`), a server action calls Shiprocket:
authenticate (token cached server-side, refreshed on 401), create an order, request AWB, request pickup.
Store on the order: `shipment: { provider: 'shiprocket', awb, courier, trackingUrl, expectedAt, labelUrl? }`.
Failures do not block the customer: retry with backoff, surface the failure in `/admin` as "Needs AWB",
and keep the order in `paid`. Never leave the customer looking at a broken tracking page.

Package defaults from `config`: weight 0.75 kg, dimensions 30×25×6 cm, pickup location code, ship-from Erode.

## 2. Status sync

`POST /api/shiprocket/webhook` — verify the shared token/signature, then map the carrier status to our five
states and append to `timeline` via the state machine:

| Carrier status | Our state |
| --- | --- |
| `PICKUP SCHEDULED`, `PICKED UP`, `IN TRANSIT` (first scan) | `shipped` |
| `OUT FOR DELIVERY` | `out_for_delivery` |
| `DELIVERED` | `delivered` |
| `RTO*`, `CANCELLED`, `LOST` | append a `note` on the current state, flag in `/admin` — do **not** invent a new customer-facing state |
| anything unrecognised | log and keep the last known state |

`timeline` is append-only and de-duplicated by `(status, carrierEventId)`. Also add a polling fallback
(Cloudflare cron every 3 hours for orders in `shipped`/`out_for_delivery`) because carrier webhooks drop events.

## 3. Tracking page

`/track/[reference]` — reachable without login, **not enumerable**: the page asks for the last 4 digits of the
phone number and verifies server-side (rate-limited, 5 attempts per 10 minutes per IP). Only then does the
server action return the view model. No order data in the HTML before verification.

Renders exactly as D7 / M5: `ORDER VLR-4821`, display headline ("On its way to Coimbatore" — city from the
address), expected date, courier + AWB, payment method, the zari stepper, then the order summary on `sand`
and **ASK ON WHATSAPP** deep-linked with prefilled context
(`https://wa.me/<number>?text=Order VLR-4821 — <saree title>`).

Delivery-window copy comes from `config.deliveryWindows` by state/region, e.g. "Tamil Nadu 2–3 days ·
South India 3–4 days · rest of India 4–6 days".

## 4. The stepper animation

Rendered from `timeline`. On mount, completed segments are already drawn — **only a newly completed segment
animates**, left→right (top→bottom on mobile) over 900ms with `cubic-bezier(0.16, 1, 0.3, 1)`, then the reached
node fades up. Track fill is the two-tone weave
`repeating-linear-gradient(90deg, #F5A623 0 7px, #F8CE5A 7px 14px)`.
Store `lastSeenStatus` in localStorage so the animation plays once, on the visit where the status changed.
Reduced motion: no draw, the segment simply appears.

## 5. Notifications

Resend email on `shipped` (AWB + tracking link + expected date) and on `delivered` (thank-you + a line inviting
a photo for the Instagram grid). Copy from `config`. Optional, if the client wants it: a WhatsApp template
message on `shipped` — flag it as a decision, do not build it unprompted.

## Acceptance

- A real (test-mode) shipment produces an AWB stored on the order and shown on `/track/[reference]`.
- Carrier webhooks append to `timeline`; the stepper renders purely from `timeline`.
- Unknown or out-of-order carrier statuses never break the page or regress a state.
- Duplicate webhook deliveries do not duplicate timeline entries.
- Tracking cannot be enumerated: wrong phone digits fail, rate limit trips, no data leaks in HTML or JSON.
- Only the newly completed segment animates, and only once.
- `/admin` shows "Needs AWB" for any paid order without a shipment.
