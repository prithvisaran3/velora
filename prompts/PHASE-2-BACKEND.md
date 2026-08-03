# Phase 2 — Backend

UI is done and must not visually change in this phase. Build the data layer behind the interfaces the view
models already use, plus the admin PWA. Still no payments, no shipping.

## 1. Firebase

Two clients: `infrastructure/firebase/admin.ts` (Admin SDK, service account from server-only env, used by
server actions, route handlers, seeds) and `infrastructure/firebase/client.ts` (web SDK, admin auth only).
Typed converters per collection — the converter is the **only** place a Firestore document becomes a domain
object.

Collections exactly as in `docs/ARCHITECTURE.md`: `sarees`, `orders`, `inventoryLocks`, `config`,
plus the reserved `sarees/{id}/ai` subdoc (create nothing in it).

## 2. Model layer

- `model/schema/*.ts` — Zod for `SareeInput`, `OrderInput`, `AddressInput`, `AdminSareeUpsert`. These are the
  boundary; nothing is written without parsing.
- `model/domain/*.ts` — entities with invariants and `toEmbeddingText()`. `Money` in paise with `add`, `format`.
- `model/service/orderStateMachine.ts` — allowed transitions only:
  `pending → paid | cancelled`, `paid → packed`, `packed → shipped`, `shipped → out_for_delivery`,
  `out_for_delivery → delivered`, `paid|packed → refunded`. Anything else throws `InvalidTransitionError`.
  Every accepted transition appends to `timeline` — append-only, never rewritten.
- `model/service/availability.ts` — single-unit reservation rules, 15-minute lock TTL.

## 3. Repositories

`FirestoreSareeRepository`, `FirestoreOrderRepository`, `FirestoreConfigRepository` implementing the interfaces
in `model/repository`. Reads are shaped for the screens that need them (`listByColour`, `listByOccasion`,
`listLatest`, `getBySlug`, `listRelated`). No `orderBy` without a composite index committed to `firestore.indexes.json`.

`infrastructure/container.ts` is the composition root; view models resolve repositories from it, never construct them.

## 4. Inventory locks (the important one)

`reserve(sareeId, cartId)` runs in a `runTransaction`: read the saree, fail if not `available`, write
`inventoryLocks/{sareeId}` with `{ cartId, expiresAt }`, set saree `status: 'reserved'`.
`release` on expiry or cart removal. A scheduled sweep (route handler + Cloudflare cron) releases stale locks.
Two concurrent reservations on one saree: exactly one succeeds, the other gets a domain error the UI renders as "Just sold".

## 5. Server actions

`viewmodel/actions/`: `createOrder` (validate → reserve → write `pending` order → return reference `VLR-####`),
`cancelOrder`, `upsertSaree`, `publishSaree`, `reorderImages`, `duplicateLastSaree`.
Each: `'use server'`, Zod parse, service call, repository write, `revalidateTag`, structured log, typed result
(`{ ok: true, data } | { ok: false, error }` — never throw across the boundary).

## 6. Security rules + seed

`firestore.rules`: public read on `sarees` where `status != 'draft'`; `config` public read; `orders`,
`inventoryLocks` and `sarees/{id}/ai` deny all client access; admin writes require `request.auth.token.admin == true`.
Ship rules unit tests against the emulator.

`scripts/seed.ts` loads the Phase 1 fixtures into the emulator and into production once.

## 7. Admin PWA at `/admin` — mobile first

She will add products from her phone, standing next to the sarees. Design for that, not for a desktop panel.

- Firebase Auth, one admin account, custom claim `admin: true`. No public sign-up. Session cookie, server-verified.
- Installable PWA: manifest, `assets/png/icon-flat-512.png`, offline shell, works on a mid-range Android.
- **Add product** in one thumb-driven column: camera-roll multi-upload → client-side compression (max 2000px,
  ~350 KB target, EXIF rotation handled) → drag to reorder → title EN + TA side by side → colour picker showing
  real swatches → occasion chips (multi) → fabric / length / blouse / zari / care / weight → publish toggle.
- **"Duplicate last product"** copies everything except images, title and colour. This is the single most
  valuable button in the admin — put it at the top.
- Tamil labels beside English on every field.
- **Orders list**: newest first, status chips, one tap to advance status (guarded by the state machine),
  customer phone as a `tel:` and WhatsApp link, address copy button.
- Optimistic UI, but never claim success before the server action resolves.

## Acceptance

- Seeding 24 sarees works against the emulator and production.
- Repository unit tests pass against the emulator, including `listByColour` pagination.
- Order can traverse every valid transition; every invalid one throws and is logged.
- Concurrent reservation test: exactly one winner.
- Rules tests: client cannot read `orders` or write `sarees`.
- A saree can be created from a phone in under 90 seconds, and duplicated in under 20.
- Storefront still renders from Phase 1 fixtures — swapping the source is Phase 3, not this phase.
