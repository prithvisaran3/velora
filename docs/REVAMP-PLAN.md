# Revamp plan

Five phases, `prompts/P0` … `prompts/P4`. One PR each, each independently deployable and each ending in a
measurement, not an opinion.

---

## P0 · De-brand and clean up (half a day, ship first)

The live site currently leaks design annotations as copy and still carries the old house name. Nothing else
matters until this is out.

- Remove every occurrence of "Bharani Pattu", "since 1978", "Lakshmi", "SECOND GENERATION", "The Erode shop".
- Delete all annotation strings that shipped as content: "hero video · 8s silent loop", "background-color 800ms
  cubic-bezier(.16,1,.3,1)", "prefers-reduced-motion → instant swap", "curator portrait · shop interior, Erode",
  "3/4 drape", "3s DRAPE LOOP" where it is not a real badge.
- Endorsement → "by Priya Mahadevan" in header, footer, metadata, OG, JSON-LD, favicon manifest.
- New logo geometry with the capital V, sized per `docs/BRAND.md`.
- Fix the price contradiction (one price or an honest range — confirm with the owner).
- `npm run lint` + a `grep -ri "bharani\|1978\|lakshmi"` gate in CI that fails the build.

**Done when:** the deployed preview contains none of those strings, the V measures cap-height, and the header
and footer read `VELORA / by Priya Mahadevan`.

---

## P1 · Chrome and content system (2–3 days)

- Tokens into Tailwind config + `globals.css` exactly as `docs/BRAND.md`.
- Rebuild Header, MobileNav, Footer, StickyBuyBar, WhatsAppFab, ScrollThread, Rule, Button, Field, Swatch,
  SareeCard, SpecTable, TrustRow, ZariStepper from the design reference.
- All UI copy moves to Firestore `config` (or a typed `content/` module if Firestore is not wired yet) — no
  merchandising strings in JSX.
- Our Story rebuilt with the approved copy in `docs/BRAND.md`.
- Two known layout defects to get right (they were found in design review): the mobile scrolling column must
  reserve ~96px for the sticky buy bar, and any block under the WhatsApp FAB reserves a ~60px right gutter.

**Done when:** every 2D screen matches the reference at 390 and 1440, Lighthouse mobile ≥ 95 on `/` and a PDP,
and no copy is hardcoded.

---

## P2 · The 3D layer (4–6 days)

Follow `docs/3D-MOTION.md` in order: canvas provider + tiering → 01 loader → 02 hero cloth → 03 colour dye →
04 PDP drape + loupe → 05 pallu unroll → 06 flight + stepper weave.

Ship after each moment, not all at once. Each lands with its poster twin first, then the scene behind a flag.

**Done when:** all six moments run on `high`, degrade correctly on `mid`, are absent on `low`, LCP is still
< 2.5s on throttled 4G, and 20 route changes leak no WebGL context.

---

## P3 · Content and commerce truth (2–3 days)

- Real photography and drape clips through ImageKit with correct `sizes`; weave crops for the loupe/3D textures.
- Single-unit inventory enforced in a Firestore transaction (15-minute lock); "Only one in stock" must be true.
- Checkout: UPI first and pre-selected, COD, cards; PIN → city/state autofill; no upsells, no timers.
- Order confirmation email (Resend), GST note, WhatsApp deep link with order context.
- SEO: per-route metadata, `Product` + `Organization` + `BreadcrumbList` JSON-LD, sitemap, OG images.
  Organization is **Velora**, founder Priya Mahadevan — no old house name anywhere in structured data.

**Done when:** a real order can be placed and paid, the confirmation arrives, and Rich Results validates.

---

## P4 · Tracking, hardening, handover (2 days)

- Shiprocket AWB on paid, status webhooks appended to an append-only `timeline`, stepper rendered from it.
- Tracking by reference + last 4 phone digits, rate-limited, not enumerable.
- Admin PWA sanity pass: camera-roll upload with compression, drag to reorder, Tamil labels, "duplicate last product".
- Error/empty states in the brand voice. Structured logs `{ event, orderId?, sareeId?, ms }`. No PII in logs.
- README + this doc updated to describe what actually shipped.

**Done when:** an order goes from placed → delivered with the zari thread drawing each new segment once, and
Priya can add a saree from her phone in under 90 seconds.

---

## Out of scope unless asked

Reviews, wishlists, coupons, loyalty, blog, multi-currency, international shipping, multi-admin roles.
Every one of them costs LCP and dilutes the promise, which is selection — not features.
