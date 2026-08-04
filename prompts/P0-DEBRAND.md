# P0 — De-brand + capital V (grounded in the actual repo)

Repo `prithvisaran3/velora@main`, read 2026-08-04. Everything below is a real file and a real string.
Read `CLAUDE.md` and `docs/BRAND.md` first. No 3D in this phase.

## Task 1 — one `Wordmark` component, six inlined copies deleted

The mark is currently hand-inlined as raw `<svg viewBox="0 0 100 124">` in at least:

| File | What it has |
| --- | --- |
| `src/view/layout/Header.tsx` (~line 47) | `w-[19px] h-[24px] mr-2` + `ELORA` + `BY BHARANI PATTU` |
| `src/view/layout/Footer.tsx` (~24) | endorsement + `ஈரோடு · 1978 முதல்` |
| `src/view/layout/MobileNav.tsx` (~63) | `BHARANI PATTU CENTRE` + Tamil line |
| `src/view/motion/VelLoader.tsx` (~40) | animated blade/spine/collar + endorsement |
| `src/view/components/AuthModal.tsx` (~91) | endorsement |
| `src/app/checkout/page.tsx` (~120) | endorsement |

Create `src/view/primitives/Wordmark.tsx` (source in `code/view/Wordmark.tsx` of this bundle — it already
follows the repo's `cn` + Tailwind + `isDark` conventions) exporting `VelMark` and `Wordmark`, then replace all
six. After this, `grep -rn 'viewBox="0 0 100 124"' src` must return **nothing** except the loader's animated
copy, which uses the new `0 0 120 100` paths.

New geometry (`docs/BRAND.md`):

```
blade   M4 0 C 24 22 46 58 60 100 C 74 58 96 22 116 0 L 86 0 C 74 22 65 50 60 72 C 55 50 46 22 34 0 Z
spine   M60 6 L65 14 L60 66 L55 14 Z
collar  M45 82 L75 82 L75 89 L45 89 Z
```

Sizing rule — this is the fix the owner asked for ("the V is very small"): the mark's ink height must equal the
wordmark's **cap height** = `0.75 × font-size`, width = `1.2 × height`, and the row must use
`items-baseline`, **not** `items-end`. In the header the wordmark is 30px, so the mark is `h-[23px] w-[27px]`
— not the current `w-[19px] h-[24px]`.

`VelLoader.tsx` keeps its beats but swaps to the new paths; `strokeWidth` becomes `2.5` at the new viewBox scale.

## Task 2 — purge the old house (24 files, 39 hits)

Replace, exactly:

- `BY BHARANI PATTU` → `BY PRIYA MAHADEVAN` — Header 68, Footer 24, AuthModal 91, checkout 120, VelLoader 70
- `MobileNav.tsx:63` `BHARANI PATTU CENTRE` → `BY PRIYA MAHADEVAN`; `:66` `ஈரோடு · 1978 முதல்` → `ஈரோடு · 1977 முதல்` (same in `Footer.tsx:28`)
- `src/app/layout.tsx:29` title → `Velora · Handpicked Silk Sarees from Erode`; `:31` description → `Handpicked pure silk sarees, curated in Erode by Priya Mahadevan. India-only free shipping.`
- `src/view/components/JsonLd.tsx` 13/16/49/53/64 → Organization `name: "Velora"`, `foundingDate: "1977"`, `founder: { "@type": "Person", "name": "Priya Mahadevan" }`, brand `"Velora"`, seller `"Velora"`
- `src/view/components/AuthenticityPanel.tsx:11` → `Chosen in Erode by Priya Mahadevan`
- `src/view/components/CuratorBand.tsx:20` → `— PRIYA MAHADEVAN · FOUNDER & CURATOR, ERODE`, and the quote above it becomes the approved one in `docs/BRAND.md`
- `src/view/components/LegacyStrip.tsx:10` → `CHOSEN IN ERODE, SINCE 1977`, and `47 YEARS TRADING` → `49 YEARS IN SILK`
- `src/model/fixtures/config.fixture.ts` 23/25/31/34 → `endorsement: "by Priya Mahadevan"`, `sinceYear: 1977`, authenticity `"Handpicked pure silk, chosen in Erode by Priya Mahadevan."`, legacy `"Silk chosen in Erode by hand since 1977."`
- `src/model/fixtures/sarees.ts:22` and `src/app/admin/add/page.tsx:28` → same authenticity string
- `src/model/domain/sareeEntity.ts:9` `toEmbeddingText()` → `… Handpicked in Erode by Priya Mahadevan since 1977. …`
- `src/infrastructure/resend/orderConfirmationTemplate.ts` 32/70 → `BY PRIYA MAHADEVAN · ERODE` and `Velora · Erode, Tamil Nadu · ஈரோடு · 1977 முதல்`
- `src/app/offers/page.tsx:43` → `CURATED SAVINGS · VELORA`

Leave alone: `SR1978…` AWB strings in `container.ts:59`, `shiprocket/client.ts:16`, `track/[reference]/page.tsx:91`
— that "1978" is a courier reference, not the brand. (Change the fake prefix to `SRVLR` if you prefer; cosmetic.)

## Task 3 — annotations that ship as customer copy

Delete from the rendered DOM:

- `src/app/page.tsx:27` `hero video · 8s silent loop · silk falling in raking light`
- `src/app/page.tsx:136` `curator portrait · shop interior, Erode`
- the Shop-by-Colour block on `page.tsx` that prints `background-color 800ms cubic-bezier(.16,1,.3,1)` and
  `prefers-reduced-motion → instant swap`
- product image captions of the form `Deep Maroon saree · 3/4 drape` — those belong in `alt`, not on screen

Where an image is missing, keep the striped placeholder **with no text** and give the `<img>` a real `alt`
from the product.

## Task 4 — story, price, CI gate

- `src/app/story/page.tsx` — replace wholesale with the approved copy in `docs/BRAND.md` §"Our Story"
  (1977 / 1996 / 2026 panels, Priya's first person, her father Mahadevan). Eyebrow `1977 — TODAY · ERODE`,
  heading `My father taught me silk before arithmetic.` Do not name the shop, a street, or a showroom size.
- Price: the home grid shows ₹2,450–₹4,800 while `config.fixture.ts:24` promises `single price point ₹3,000`.
  Ask the owner which is true and make it consistent — copy, fixtures, JSON-LD `Offer`, metadata.
- Add `scripts/check-brand.sh` (in this bundle) and run it in CI + as a pre-commit hook.

## Acceptance

```
bash scripts/check-brand.sh          # exits 0
grep -rn 'viewBox="0 0 100 124"' src # nothing
```

Plus: header and footer read `VELORA / BY PRIYA MAHADEVAN`; the mark measures 23px tall against the 30px
wordmark and sits on the baseline; `/story` shows the new copy; the deployed preview's page source contains no
annotation text. Report the preview URL and header screenshots at 390 and 1440.
