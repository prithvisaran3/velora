/**
 * Velora domain types — src/model/domain/types.ts
 *
 * Money is always an integer in paise. Never a float, never formatted here.
 * Bilingual fields are paired so translation can be automated per field.
 * `toEmbeddingText()` lives on the entity factories, not on these types.
 */

export type Paise = number & { readonly __brand: "Paise" };
export const paise = (n: number): Paise => {
  if (!Number.isInteger(n) || n < 0) throw new Error(`Invalid paise: ${n}`);
  return n as Paise;
};

export type ColourKey =
  | "maroon" | "peacock" | "indigo" | "leaf" | "plum" | "kora" | "saffron" | "marigold";

export type OccasionKey =
  | "muhurtham" | "reception" | "temple" | "festival" | "office" | "everyday";

export type SareeStatus = "draft" | "available" | "reserved" | "sold";

export interface Bilingual {
  en: string;
  ta: string;
}

export interface ImageRef {
  id: string;          // ImageKit file path or local asset path
  alt?: string;        // human alt; falls back to generated text
  aspect: "3/4" | "1/1" | "4/5" | "16/9";
  order: number;
}

export interface VideoRef {
  id: string;          // ImageKit path, 3s silent drape loop
  posterId: string;
  durationMs: number;
  bytes: number;       // enforced <= 400_000 at upload
}

export interface Colour {
  key: ColourKey;
  label: Bilingual;
  hex: string;         // saree hue — product data, never chrome
}

export interface Saree {
  id: string;
  slug: string;
  title: Bilingual;
  priceInPaise: Paise;          // 300000
  status: SareeStatus;
  colour: Colour;
  occasions: OccasionKey[];
  fabric: string;               // "Pure mulberry silk"
  lengthCm: number;             // 630
  blousePieceCm: number;        // 80
  zari: string;                 // "Half-fine, 4 inch border"
  care: string;                 // "Dry clean only"
  weightGrams: number;          // 640
  images: ImageRef[];
  drapeVideo?: VideoRef;
  authenticityNote: string;
  curatorNote?: string;
  publishedAt?: string;         // ISO
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  line1: string;
  line2?: string;
  landmark?: string;
  pincode: string;              // 6 digits
  city: string;                 // auto-filled from pincode, editable
  state: string;
}

export interface Customer {
  name: string;
  phone: string;                // 10 digits, India
  email?: string;
}

export type PaymentMethod = "upi" | "cod" | "card" | "netbanking";

export interface Payment {
  method: PaymentMethod;
  provider: "razorpay" | "cod";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  verifiedAt?: string | null;   // null for COD
}

export interface Shipment {
  provider: "shiprocket";
  awb?: string;
  courier?: string;
  trackingUrl?: string;
  expectedAt?: string;
  labelUrl?: string;
}

export type OrderStatus =
  | "pending" | "paid" | "packed" | "shipped" | "out_for_delivery"
  | "delivered" | "cancelled" | "refunded";

/** The five customer-facing stepper states, in order. */
export const STEPPER_STATES = ["paid", "packed", "shipped", "out_for_delivery", "delivered"] as const;
export type StepperState = (typeof STEPPER_STATES)[number];

export interface TimelineEntry {
  status: OrderStatus;
  at: string;                   // ISO
  note?: string;
  carrierEventId?: string;      // de-dupe key for Shiprocket webhooks
}

export interface OrderItem {
  sareeId: string;
  slug: string;
  title: Bilingual;             // snapshot at purchase — do not resolve live
  priceInPaise: Paise;
  imageId: string;
}

export interface Order {
  id: string;
  reference: string;            // "VLR-4821"
  status: OrderStatus;
  items: OrderItem[];           // single-unit sarees, usually length 1
  totals: {
    subtotalInPaise: Paise;
    shippingInPaise: Paise;     // 0 — free across India
    totalInPaise: Paise;
  };
  customer: Customer;
  address: Address;
  payment: Payment;
  shipment?: Shipment;
  timeline: TimelineEntry[];    // append-only; the ONLY source for the stepper
  createdAt: string;
  updatedAt: string;
}

export interface InventoryLock {
  sareeId: string;
  cartId: string;
  expiresAt: string;            // 15 minutes
}

/** Reserved for future AI features — shape fixed now, written to later. */
export interface SareeAiDoc {
  embedding?: number[];
  embeddingModel?: string;
  embeddedAt?: string;
  tags?: string[];
}

/** Server-action result — never throw across the view boundary. */
export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };
