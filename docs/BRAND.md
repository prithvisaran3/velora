# Brand — Velora v2

## Name plate

```
VELORA                 ← the V is the vel: a full capital, cap-height matched
by Priya Mahadevan     ← endorsement, small caps, .34em, ~29% of the wordmark's cap height
```

The "V" of Velora **is** the mark: a leaf-shaped vel blade whose counter carries the blade's central spine and
whose tip carries a collar bar. It is Lord Murugan's vel read as the mangai (paisley) motif from South Indian
saree borders — devotional to a Tamil viewer, elegant abstract geometry to everyone else.

### Geometry (do not redraw — copy these paths)

`viewBox="0 0 120 100"`, ink fills the box edge to edge.

```
blade   M4 0 C 24 22 46 58 60 100 C 74 58 96 22 116 0 L 86 0 C 74 22 65 50 60 72 C 55 50 46 22 34 0 Z
spine   M60 6 L65 14 L60 66 L55 14 Z
collar  M45 82 L75 82 L75 89 L45 89 Z      (drop below 20px rendered width)
```

Blade takes the primary colour, spine and collar the secondary (marigold on cream, turmeric on saffron/ink).
One-colour versions use a single fill for all three.

### Sizing rule — this is what was wrong before

The old mark rendered at 86% of cap height and read as a small ornament. Correct construction:

```tsx
const capHeight = fontSizePx * 0.75;          // Bodoni Moda
<span className="flex items-baseline">        {/* baseline, NOT items-end */}
  <svg viewBox="0 0 120 100"
       style={{ height: capHeight, width: capHeight * 1.2, marginRight: fontSizePx * 0.28 }} />
  <span className="wordmark">ELORA</span>     {/* letter-spacing .28em, margin-right -.28em */}
</span>
```

Apex lands on the cap line, tip lands on the baseline. Verify at 68px: ink height must measure 51px.

### Endorsement

`BY PRIYA MAHADEVAN` — Archivo 400, uppercase, letter-spacing `.34em`, `margin-right:-.34em`,
font-size ≈ 0.20 × wordmark font-size (13–14px against a 68px wordmark). It is a maker's mark, not a subtitle.
Never bold, never larger, never on the same line as the wordmark.

### Tamil lockup

`வெலோரா` in Anek Tamil 500, with `பிரியா மகாதேவன்` beneath at ~⅓ the size. Use on the footer, the Tamil
toggle and packaging. Never machine-translate headings into Tamil.

## Colour

Retoned to the approved **Thread v9** direction. Kora beige is the ground and saffron sits deeper, so the
gold thread is the brightest thing on the page.

| Token | Hex | Use |
| --- | --- | --- |
| cream | `#EDE2CE` | page base |
| panel | `#FBF6EC` | cards, asides, quiet panels on cream |
| sand | `#F7F0E3` | top of a raised surface |
| dune | `#E7DAC2` | foot of a raised surface |
| saffron | `#C6521A` | primary action, blade, links |
| pressed | `#8E3410` | hover/pressed, small emphasis, error |
| marigold | `#F5A623` | spine + collar of the mark |
| turmeric | `#F8CE5A` | tint on saffron/ink grounds only |
| ink | `#241F1C` | text, dark sections, footer |
| peacock | `#12514E` | WhatsApp affordance only |

**The thread.** Three layers per filament — one strand looks like a line, three looks like twisted silk:

| Token | Hex | Layer |
| --- | --- | --- |
| `--thread` | `#C9901E` | dull base strand |
| `--thread-lit` | `#FFDD8E` | bright filament, light running along it |
| `--thread-spec` | `#FFF3D2` | rare white specular, passes every few seconds |

Gold is home. On a product or colour page these three are reassigned to the saree's hue over 900ms and
returned to gold on the way out — see `src/view/thread/palette.ts`. The ground shifts about 4% toward the
same hue. **Her photographs are never colour-shifted**: that would be lying about the product.

Saree hues (product data, never chrome): maroon `#8C1B30` · peacock `#12514E` · indigo `#2E4A7D` ·
leaf `#4E7031` · plum `#6B3FA0` · kora `#C7B48A`.

No gradients on the logo. No shadows except the warm brown card lift
(`0 16px 26px -12px rgba(120,84,40,.55)`). No border radius except circles.

## Type

Bodoni Moda (display + wordmark) · Archivo 300/400/500 (body + UI) · Anek Tamil (Tamil).
Display clamp(3rem, 6vw, 7rem). Body 14–15px desktop / 12–13px mobile, line-height 1.7–1.85.
UI labels 10–12px uppercase `.2em`–`.3em`. Spec-table labels 55% ink, values full ink.
Never below 12px on mobile except the endorsement and legal microcopy.

## Our Story — approved copy (use verbatim; it is the site's strongest trust asset)

Heading: **My father taught me silk before arithmetic.**
Tamil: என் தந்தை எனக்கு கற்பித்த பட்டு
Eyebrow: 1977 — TODAY · ERODE

**1977 — A thousand square feet of silk.** My father, Mahadevan, opened his first shop with his brother beside
him and very little else. He was no designer and never claimed to be one — he could tell you from the cloth
between two fingers which loom it came off, and whether the zari would hold its colour after ten years folded
in a steel trunk.

**1996 — He sends me to the weavers alone.** I was nineteen. He never asked what I had bought — he would
unfold it, hold it to the door light, and nod, or not nod. Thirty years later I am still buying the way he
taught me.

**2026 — Velora.** The same hands, now reaching a woman in Bengaluru who will never stand at my counter. Every
saree here is one I have held to the light myself, and there is only ever one of each.

Signature: **Priya Mahadevan** · FOUNDER & CURATOR · ERODE, TAMIL NADU

Home page curator quote: *"My father could tell you which loom a saree came off with his eyes shut. He sent me
to the weavers alone at nineteen. I still hold every one to the light before it goes on this website."*
Tamil: ஒவ்வொரு புடவையும் என் கையால் தேர்ந்தெடுக்கப்பட்டது.

Stats strip: **Chosen in Erode, since 1977** · 49 years in silk · 3 generations · 48 sarees a month.

### Copy guardrails

The shop is deliberately **not named**. Do not add it, do not link it, do not mention a street address or a
showroom size. "1977", "Erode", "my father Mahadevan" and "three generations" are the only lineage facts used.
Photography for this page (Mahadevan at his counter, Priya buying) is owner-supplied — use the striped
placeholder treatment until it arrives, with no visible annotation text.
