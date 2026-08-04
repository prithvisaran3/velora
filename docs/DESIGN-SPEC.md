> Superseded where it conflicts with `BRAND.md` and `3D-MOTION.md` (v2). Brand names and the logo
> construction in this file were auto-updated; if anything still reads "Bharani", it is a bug — report it.

# Design specification

Everything here is measured off the approved frames in `design/Velora Website v2.dc.html`.
Frame ids: **D1–D7** desktop (1440), **M1–M6** mobile (390), **S1** motion sheet, **S2** component sheet.

## 1. Colour

| Token | Hex | Use |
| --- | --- | --- |
| `cream` | `#FDF4E4` | page base, reversed text on saffron/ink |
| `saffron` | `#E8621B` | primary action, blade of the mark, fabric wipe |
| `marigold` | `#F5A623` | spine + collar of the mark, zari rules, stepper thread, footer headings |
| `turmeric` | `#F8CE5A` | tint — only on saffron or ink grounds |
| `pressed` | `#B4470F` | button pressed/hover, small emphasis labels, error border |
| `ink` | `#241F1C` | body text, dark sections, footer |
| `sand` | `#F6EAD6` | quiet panel inside cream (authenticity block, curator band) |
| `peacock` | `#12514E` | WhatsApp affordance only |

Saree hues, product data only — never chrome: maroon `#8C1F3D`, peacock `#12514E`, indigo `#2E4A7D`,
leaf `#4E7031`, plum `#6B3FA0`, kora `#F3EADC`, saffron and marigold reuse the brand values.

Text opacities on cream: primary `ink`, secondary `rgba(36,31,28,.78)`, tertiary `rgba(36,31,28,.6)`,
labels `rgba(36,31,28,.55)`. On ink: `cream`, then `rgba(253,244,228,.75)`, `rgba(253,244,228,.6)`.
Hairlines: `rgba(36,31,28,.12)` on cream, `rgba(245,166,35,.35)` on ink.

## 2. Typography

| Role | Family | Spec |
| --- | --- | --- |
| Display | Bodoni Moda | clamp(3rem, 6vw, 7rem), line-height .94–1.04, no tracking |
| Wordmark | Bodoni Moda | uppercase, letter-spacing `.28em`, compensate with `margin-right:-.28em` |
| Endorsement | Archivo 400 | uppercase, `.34em`, ~29% of wordmark cap height, `margin-right:-.34em` |
| Section head | Bodoni Moda | desktop 44px, mobile 26–30px |
| Product title | Bodoni Moda | desktop 19–22px, mobile 14–16px |
| Body | Archivo 300/400 | 14–15px desktop, 12–13px mobile, line-height 1.7–1.85 |
| UI label | Archivo 400 | 10–12px, uppercase, `.2em`–`.3em` |
| Spec table | Archivo | label 11–12px `.16em` at 55% ink; value 12–13px full ink |
| Tamil | Anek Tamil 400/500 | never a translation of a heading — used where it adds warmth (hero sub, PDP subtitle, footer, curator note) |
| Dev annotations | any monospace | 9–11px — **design-file only, do not build** |

Line lengths cap at ~62ch. `text-wrap: pretty` on paragraphs, `balance` on display headings.

## 3. Grid, spacing, radii

* Desktop content gutter 64px; section rhythm 72px vertical; card grids gap 24px.
* Mobile gutter 18px; section rhythm 20–26px; card grid 2-up gap 12px.
* Scale: 4 / 6 / 8 / 10 / 12 / 14 / 18 / 20 / 22 / 26 / 28 / 36 / 44 / 56 / 64 / 72.
* **Radius is 0 everywhere** except circles (swatches, avatars, WhatsApp FAB, stepper nodes).
* No shadows. Depth comes from ground colour changes and hairlines. Two exceptions, both circles:
  selected swatch ring `0 0 0 3px <pageBg>, 0 0 0 5px <swatchColour>` and the active stepper node's
  `0 0 0 5px rgba(232,98,27,.18)`.
* Product images are `3/4`. Occasion tiles `4/5` (grid) or 520×420 (editorial rows). Instagram tiles `1/1`.

## 4. Components (S2)

**Button** — 48px min height desktop, 56px mobile, 12px label at `.22em`, no radius.
Primary saffron/cream · pressed `#B4470F` · secondary 1px `rgba(36,31,28,.35)` on transparent ·
WhatsApp 1px peacock on transparent, peacock label · disabled `rgba(36,31,28,.12)` bg, 45% ink label.
Hover: background → `pressed` over 220ms. Focus: 2px marigold outline, 3px offset. Never a hover-only affordance on mobile.

**Field** — 1px `rgba(36,31,28,.3)`, 15px/16px padding, 13px value, placeholder 45% ink.
Focus 1px saffron. Auto-filled (PIN → city/state) `sand` bg + 1px `rgba(36,31,28,.15)`, still editable.
Error 1px `#B4470F` + 11px `#B4470F` note beneath. Labels sit above as 9–11px `.28em` at 55% ink.

**SareeCard** — 3/4 image, "3s DRAPE LOOP" badge top-left (cream chip, 8px `.2em`), title (Bodoni 19px),
`Pure silk · ₹3,000` (11px), optional `ONLY ONE IN STOCK` in `pressed` 10px `.16em`.
Desktop hover cross-fades flat-lay → draped over 600ms. Mobile: same cross-fade fires on scroll-into-view.

**Swatch** — 72px rest, 78px hover, 78px + double ring selected, 28% opacity sold-out.
44px minimum touch target on mobile with 12px gaps; on M1 the row bleeds past the gutter so the next swatch
is deliberately half-visible (carousel peek), not accidentally clipped.

**ZariStepper** — five states Confirmed → Packed → Shipped → Out for delivery → Delivered.
Track `rgba(36,31,28,.14)`; completed track is a woven two-tone `repeating-linear-gradient(90deg, marigold 0 7px, turmeric 7px 14px)`.
Nodes 15px (13px mobile), reached = marigold, active = 19px saffron with the soft ring, future = 1px 30% ink outline.
Desktop horizontal, mobile vertical.

**ScrollThread** — 3px column, right gutter 26px desktop, track 10% ink, fill marigold, height = scroll progress.

**Rule (section divider)** — 1px `linear-gradient(90deg, transparent, marigold 12%, marigold 88%, transparent)`,
scaled from the left over 900ms on enter.

**Header** — desktop: nav left / centred stacked logo + endorsement / utilities right, 22px 64px padding,
`gap:36px` minimum and `flex-shrink:0; white-space:nowrap` on both nav clusters (the letterspaced wordmark
overruns its box otherwise). Marigold hairline under. Mobile: MENU / wordmark + endorsement / BAG at 14px 18px.

**Footer** — ink ground, reversed logo with marigold spine, four columns (brand + Tamil line, SHOP, HELP, THE HOUSE),
marigold hairline, then the trust row: COD AVAILABLE · GST INVOICE · 7-DAY RETURN · SHIPS ACROSS INDIA 3–6 DAYS · UPI · CARDS · NETBANKING.

**StickyBuyBar** (mobile) — cream, 1px top hairline, 14px 18px, left column `INCL. GST` 9px + `₹3,000` Bodoni 22px,
right primary button filling remaining width. **The scrolling column above it must reserve ~96px bottom padding.**

**WhatsAppFab** — 52px peacock circle, right 16px, above the sticky bar (bottom 94px) or bottom 24px where there is none.
Any block it overlaps reserves a ~60px right gutter.

## 5. Screens

**D1 / M1 · Home** — header → hero (full-bleed fabric video, poster frame first, display headline + two CTAs)
→ ink legacy strip ("The Erode house, since 1977." + 47 / 3 / 48) → Shop by Occasion (6 tiles, 3/4)
→ Shop by Colour (copy left, swatch row right) → This month's edit (4-up desktop, 2-up mobile)
→ curator band on `sand` (portrait + pull quote + Tamil line + attribution) → Instagram grid (6-up)
→ footer. Mobile order: hero → legacy → colour row → occasion/curator links → edit grid → curator → Instagram → footer.

**D2 / M2 · Shop by Colour** — the primary navigation. Header adopts the selected hue. Centred display
heading, swatch wheel (7 desktop / 8 mobile 4-up), then `Maroon · 9 sarees` + filters, then the grid.
Selecting a colour cross-dyes page background, header and card frames over **800ms**; text colour is
recalculated for contrast, never animated. Desktop also carries the **pallu scroll**: vertical scroll drives a
2400px horizontal track, body → border → pallu with marigold annotations, on an ink ground. Not built on mobile.

**D3 · Shop by Occasion** — display "Six moments", then alternating editorial rows (520×420 image + copy +
CTA) for Muhurtham and Temple, then a 4-up grid for Reception / Festival / Office / Everyday with counts.
Occasions are moments, not categories: copy is written per occasion.

**D4 / M3 · PDP** — desktop 840px media column (700px flat-lay hero + three 180px tiles: draped, pallu detail,
drape video) beside a 56px-padded detail column: `HANDPICKED · JULY EDIT` → title → Tamil title → ₹3,000 +
`INCL. GST · FREE SHIPPING` → ADD TO BAG → ASK ON WHATSAPP → spec table (fabric, length, blouse piece, zari,
care, weight) → authenticity panel on `sand` → related sarees 4-up.
The hero carries the **loupe**: pointer becomes a 250px circle at 3× magnification with a 220ms follow lag,
marigold 2px edge. Mobile: 470px media with dot indicators, pinch to zoom, spec table trimmed to four rows,
sticky buy bar, FAB.

**D5 / M6 · Our Story** — ink ground. `1977 — TODAY`, display "Three generations, one shop.", Tamil line, then
three alternating panels (1977 / 1996 / 2026) with 560×440 archival images. Grain opacity and sepia filter
animate to 0 as each panel enters (900ms). Mobile keeps the panels, drops the alternation.

**D6 / M4 · Cart & Checkout** — single 720px column, centred logo-only header, no nav, no upsells.
Bag line (110×146 thumb, title, spec line, `HANDPICKED · ONLY ONE IN STOCK`, price) → address block
(name + mobile, street, then PIN / city / state where PIN fills the last two on blur) → payment with
**UPI first and pre-selected**, then COD, then Card/Netbanking → totals (subtotal, shipping "Free", total,
"Inclusive of GST. Invoice emailed on dispatch.") → PLACE ORDER · ₹3,000 → trust row.

**D7 / M5 · Order Tracking** — `ORDER VLR-4821`, display "On its way to Coimbatore", right column with
expected date, courier + AWB, payment method. Zari stepper. Order summary card on `sand` + ASK ON WHATSAPP.

## 6. Motion (S1)

Easing everywhere: `cubic-bezier(0.16, 1, 0.3, 1)`.

| Moment | Duration | Behaviour |
| --- | --- | --- |
| Loader | 900ms max | 0–260 vel outline draws (stroke-dashoffset) · 260–420 outline closes, marigold spine + collar fade in · 420–520 saffron fill floods the blade, held one beat · 520–780 saffron panel pulls upward with a 5% soft fold-gradient edge · 780–900 page revealed |
| Page transition | 780ms | saffron panel sweeps with the same fold edge — never a hard rectangle |
| Colour dye | 800ms | background-color on page, header, card frames |
| Card cross-fade | 600ms | flat-lay → draped (hover desktop, scroll-into-view mobile) |
| Add to bag | 720ms | image folds on two axes and flies to the bag icon; bag pulses once in marigold |
| Divider draw | 900ms | scaleX from left |
| Loupe | 220ms | magnifier follows pointer with lag |
| Scroll | Lenis | weighted, no inertia bounce |

Reduced motion: loader shows the finished mark for 200ms; wipes become 120ms cross-fades; drape loops show
poster frames with a play control; colour dye is instant; dividers appear undrawn. Nothing is lost, only stilled.

## 7. Performance budget (a design constraint)

* LCP < 2.5s on 4G mid-range Android. Hero poster is a real `<img>` with `fetchpriority="high"`; video attaches after LCP.
* Drape loops: 3s, ≤400 KB, `muted playsinline preload="none"`, mounted only within one viewport.
* Loupe uses a single 1600px crop, not a tile pyramid.
* Pallu scroll and GSAP are desktop-only and lazily imported.
* If a moment is beautiful but costs 300ms of LCP, cut the moment.

## 8. Assets

`assets/svg` logos (icon, lockups stacked/horizontal, wordmark, Tamil lockup, mono, favicon),
`assets/png` icon 1024→24, icon-on-saffron, favicon 32/16, Instagram avatar 1080,
`assets/tokens` `brand-tokens.css` + `brand-colors.json`, `assets/README.md` clear space and don'ts.
Lockup SVGs use live text — install Bodoni Moda, Archivo and Anek Tamil, or outline the text before print.
