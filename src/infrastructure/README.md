# Infrastructure Layer

The `infrastructure/` layer implements domain repository interfaces and provides transport/third-party adapters.

## Rules & Constraints
- Contains SDK initializations (Firestore, Razorpay, Shiprocket, ImageKit, Resend) and concrete repository implementations.
- Concrete repositories MUST return domain objects (never raw Firestore `DocumentSnapshot` objects).
- The composition root `infrastructure/container.ts` constructs and exports concrete repositories.
- Components or view models must NEVER construct SDK adapters directly; they resolve interfaces via the container.
