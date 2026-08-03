# View Layer

The `view/` layer is pure presentation. Props in, JSX out.

## Rules & Constraints
- NO fetching or direct API/database calls.
- NO business rules or pricing logic (all UI text & data come from View Models/fixtures).
- NO imports from `infrastructure/**` or `firebase/*`.
- NO hardcoded UI copy — all copy comes from props or config fixtures.
- Subdirectories:
  - `primitives/`: Button, Field, Swatch, Rule, Price, Badge, Label, SectionHead, TamilText.
  - `components/`: SareeCard, ColourWheel, SpecTable, AuthenticityPanel, TrustRow, ZariStepper, etc.
  - `layout/`: Header, MobileNav, Footer, StickyBuyBar, WhatsAppFab, ScrollThread.
  - `motion/`: VelLoader, PageTransition, FabricWipe, Reveal, AddToBagFlight.
