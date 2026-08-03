# Model Layer

The `model/` layer owns application truth and business rules.

## Rules & Constraints
- Must contain ONLY domain entities, value objects (e.g. `Money` in integer paise), Zod validation schemas, repository interfaces, and pure domain services.
- **NO React or Next.js imports** (`react`, `next/*`).
- **NO Firebase or SDK imports** (`firebase/*`, `imagekit`, etc.).
- Every entity MUST expose `toEmbeddingText()` for future AI integration.
- Money MUST always be represented as an integer in paise (`Paise` branded type). Never floats.
