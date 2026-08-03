# ViewModel Layer

The `viewmodel/` layer shapes domain data for presentation and holds client state / server action handlers.

## Rules & Constraints
- Server View Models (`viewmodel/server/`): Async functions called strictly by `app/(store)/*/page.tsx` to prepare structured props for View components.
- Client View Models (`viewmodel/client/`): Custom hooks for interactive surfaces (`useCart`, `useColourDye`, `useLoupe`, `useAddToBagFlight`).
- Server Actions (`viewmodel/actions/`): Marked `'use server'`, validate inputs via Zod schemas, execute services/repositories, return typed `ActionResult<T>` objects (never throw).
