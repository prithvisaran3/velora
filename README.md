# Velora — revamp handoff for Claude Code

Existing repo: https://github.com/prithvisaran3/velora · live: https://velora-saree.vercel.app

Start here: **CLAUDE.md** (put it at the repo root), then work `prompts/P0 → P4` in order.

```
CLAUDE.md                            project constitution — hard rules, architecture, working agreement
docs/BRAND.md                        palette, capital-V geometry + sizing rule, endorsement, Our Story copy
docs/3D-MOTION.md                    the six 3D moments: technique, placement, fallback, frame budget
docs/REVAMP-PLAN.md                  five phases with acceptance criteria
docs/DESIGN-SPEC.md                  every screen and component, measured (auto-updated to v2 brand)
docs/ARCHITECTURE.md                 MVVM layering, Firestore model, integrations, AI-readiness
prompts/P0-DEBRAND.md                remove the old house name + annotations that shipped as copy
prompts/P1-CHROME.md                 tokens, primitives, all seven screens, content out of JSX
prompts/P2-3D.md                     the 3D layer, one moment per PR
prompts/P3-P4-COMMERCE-TRACKING.md   images, single-unit truth, payments, tracking, admin, hardening
code/                                drop-in: globals.css, tailwind.config.ts, lib/motion.ts (+3D constants),
                                     view/Wordmark.tsx, three/tier.ts, three/materials/silk.ts,
                                     types/domain.ts, scripts/check-brand.sh, package.json, env.example
design/Velora Website v2.dc.html     the approved design — open in a browser (keep support.js beside it)
design/Velora Direction v3.dc.html   logo before/after, palette study, Our Story rationale
assets/                              regenerated logo kit: capital V, "by Priya Mahadevan"
```

## The three things that matter most

1. **"Bharani Pattu" appears nowhere.** `code/scripts/check-brand.sh` fails the build if it does — wire it into CI in P0.
2. **The V is a full capital**, ink height == wordmark cap height, baseline-aligned. One `Wordmark` component, everywhere.
3. **3D never delays the first product image.** One WebGL context created after LCP, poster twin for every scene,
   device tiering, and `prefers-reduced-motion` means no canvas at all.

Design files are HTML **references**, not source. Recreate them in the repo's Next.js + Tailwind — never copy the markup.
