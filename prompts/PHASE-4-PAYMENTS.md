# Phase 4 — Payments (Razorpay, UPI first)

Money is involved. Assume the client is hostile and the network is unreliable. Nothing about an order's paid
state is ever decided by the browser.

## 1. Order creation

`createRazorpayOrder` server action: take the Velora order reference (from Phase 2), amount in **paise**
recomputed server-side from the saree documents — never from the client payload — currency `INR`,
`receipt: reference`, `notes: { reference, sareeId }`. Store `payment.razorpayOrderId` on the order.
Reject if the inventory lock has expired, if the saree is no longer `available`/`reserved` by this cart,
or if the amount does not match `totals.totalInPaise`.

## 2. Client checkout

Razorpay Checkout script loaded **only on `/checkout`**, `next/script` `lazyOnload`, so it never touches LCP
elsewhere. Prefill name, phone, email. Theme colour saffron `#E8621B`.
**UPI is the first and pre-selected method**, then COD, then Card/Netbanking — as designed in D6/M4.
The client callback is treated as a *hint* to show optimistic UI; it is never trusted for state.

## 3. Verification — two independent paths

**a. Route handler `POST /api/razorpay/verify`** — recompute `HMAC_SHA256(razorpay_order_id + '|' + razorpay_payment_id, key_secret)`
with `crypto.timingSafeEqual`. On match, transition `pending → paid` through the state machine, convert the
inventory lock to `status: 'sold'`, append to `timeline`, trigger the confirmation email. Idempotent by
`razorpayPaymentId`.

**b. Route handler `POST /api/razorpay/webhook`** — verify `x-razorpay-signature` against the **webhook secret**
(different from the key secret), on the raw body (do not parse before verifying — read the raw text).
Handle `payment.captured`, `payment.failed`, `order.paid`, `refund.processed`.
Idempotent: keep `processedWebhooks/{eventId}`; a replay is a no-op. This path is authoritative — a payment that
succeeds while the user closes the tab still marks the order paid.

Both paths converge on one service function, `settlePayment(...)`, so there is exactly one place that can mark
an order paid.

## 4. COD

No gateway call. `pending → paid` is **not** used; COD orders go to a `paid`-equivalent `confirmed` note in
`timeline` with `payment.method: 'cod'` and `payment.verifiedAt: null`, and are fulfillable.
Guard: COD available only for pincodes in `config.codPincodePrefixes`; if unavailable, the option is disabled
with a one-line reason, not hidden.

## 5. Failure, abandonment, refunds

- Failed payment: order stays `pending`, lock keeps its remaining TTL, UI offers retry with the same reference.
- Abandoned checkout: lock expires after 15 minutes, saree returns to `available`, order marked `cancelled` by the sweep.
- Refund: admin-triggered server action → Razorpay refund API → `refunded` transition on webhook confirmation, never optimistically.
- Every payment event logged: `{ event: 'payment.settled', orderId, reference, method, amountInPaise, ms }`.
  No card data, no UPI VPA, no phone numbers in logs.

## 6. Invoice / GST

Confirmation email states GST-inclusive pricing and that the GST invoice follows on dispatch, with the Bharani
Pattu Centre GSTIN from `config`. If a proper invoice PDF is wanted, note it as a follow-up — do not build it now.

## Acceptance

- UPI, card and COD each produce a correct order with correct paise amounts.
- Webhook replay is a no-op; two concurrent settlements produce one `paid` transition.
- A tampered client callback (wrong signature, altered amount) is rejected and logged.
- Closing the tab mid-payment still results in a paid order via webhook.
- Test-mode end-to-end passes, then repeat once in live mode with a ₹1 test SKU that is never published.
- `key_secret` and webhook secret appear nowhere in the client bundle.
