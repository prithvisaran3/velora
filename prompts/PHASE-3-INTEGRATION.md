# Phase 3 — Integration

Swap fixtures for live data, put images on ImageKit, send email, ship SEO, deploy to Cloudflare.
No visual change to the approved design is permitted in this phase. If live data breaks a layout, fix the
component's constraints — not the design.

## 1. Fixtures → repositories

Every `viewmodel/server/*.viewmodel.ts` resolves its repository from `infrastructure/container.ts`.
Delete nothing from `model/fixtures` — keep them as the test and Storybook source.

Caching: `unstable_cache` / `revalidateTag` per collection (`sarees`, `saree:{slug}`, `config`).
Writes in Phase 2 already call `revalidateTag`; verify each one. `/checkout`, `/bag`, `/track/*` are dynamic.

Empty and error states, designed in the same language as the rest: a colour with no sarees says
"Nothing in maroon this month — the next edit lands in early September", not "0 results".

## 2. ImageKit

`infrastructure/imagekit/url.ts` — build URLs with transforms; `srcset` at 390/540/768/1080/1440/1920,
`sizes` per component (`SareeCard` on mobile is `50vw`, desktop `25vw`; PDP hero `min(840px, 100vw)`).
Format auto (AVIF/WebP), quality 78 for grids, 85 for the PDP hero, `blur` LQIP as the placeholder.
Video: 3s drape loops served `muted playsinline preload="none"`, poster from ImageKit, `≤400 KB` enforced by an
upload-time check in the admin.

Admin uploads go through a server action that signs an ImageKit upload — the client never sees the private key.

## 3. Email (Resend)

`infrastructure/resend/send.ts` + a plain, typographic HTML template matching the brand (cream ground, ink
text, marigold hairline, wordmark + endorsement, no images beyond the logo).
Order confirmation: reference, saree, ₹ amount, payment method, address, delivery window by region from
`config`, GST invoice note, WhatsApp link. Send from a server action/webhook only, never the client.
Template copy lives in `config`, not in the template file.

## 4. SEO — this is a revenue feature, not hygiene

- `generateMetadata` per route: title/description from real product data, canonical, OG + Twitter cards.
  Product titles read like `Maroon zari pallu pure silk saree · ₹3,000 · Velora by Bharani Pattu`.
- JSON-LD: `Product` (+`Offer` with `INR`, `availability`, `itemCondition`), `Organization` (Bharani Pattu
  Centre, Erode, founded 1978, `sameAs` Instagram/WhatsApp), `BreadcrumbList`, `WebSite` with `SearchAction`.
- `sitemap.ts` and `robots.ts` generated from the repository; ISR so new sarees appear within minutes.
- OG images via `next/og` on the brand: cream ground, saree image, wordmark + endorsement, ₹3,000.
- Alt text: human-written if present, else generated from `toEmbeddingText()`.
- Target queries: "silk saree Erode", "handpicked silk saree online", "Bharani Pattu", "₹3000 silk saree",
  Tamil equivalents. Reflect them in real copy — no keyword stuffing.

## 5. Deploy — Cloudflare

`@opennextjs/cloudflare`, Pages project bound to the repo, secrets set in the dashboard (never in the repo):
Firebase admin credentials, ImageKit private key, Resend key. Public: Firebase web config,
`NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`. Custom domain via Cloudflare Registrar, HTTPS enforced, Brotli, cache rules
for `/_next/static/*` and ImageKit passthrough. Preview deploys on PRs.

Add a Cloudflare cron for the stale-lock sweep from Phase 2.

## Acceptance

- Every route renders live Firestore data; no fixture import remains outside tests.
- Images serve from ImageKit with correct `sizes`; no image over 200 KB on mobile grids.
- LCP < 2.5s and CLS < 0.05 on throttled 4G for `/` and `/saree/[slug]` (measure on the deployed URL, not localhost).
- Rich Results test passes for `Product` and `Organization`; sitemap lists every published saree.
- A test order sends a correct confirmation email.
- No secret appears in the client bundle (`grep` the build output).
