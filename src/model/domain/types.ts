export type Currency = "INR";
export type MoneyPaise = number & { readonly __brand: "paise" };

export function paise(amount: number): MoneyPaise {
  if (!Number.isInteger(amount) || amount < 0) {
    throw new Error(`Invalid money amount in paise: ${amount}`);
  }
  return amount as MoneyPaise;
}

export type ColourKey = "maroon" | "peacock" | "indigo" | "leaf" | "plum" | "kora" | "saffron" | "marigold";

export type OccasionKey = "muhurtham" | "reception" | "temple" | "festival" | "office" | "everyday";

export type SareeStatus = "draft" | "available" | "reserved" | "sold";

export type AspectRatio = "3/4" | "1/1" | "4/5" | "16/9";

export interface SareeImage {
  id: string;
  alt?: string;
  aspect: AspectRatio;
  order: number;
}

export interface LocalizedText {
  en: string;
  ta: string;
}

export interface Saree {
  id: string;
  slug: string;
  title: LocalizedText;
  priceInPaise: MoneyPaise;
  status: SareeStatus;
  colour: {
    key: ColourKey;
    label: LocalizedText;
    hex: string;
  };
  occasions: OccasionKey[];
  fabric: string;
  lengthCm: number;
  blousePieceCm: number;
  zari: string;
  care: string;
  weightGrams: number;
  images: SareeImage[];
  drapeVideo?: string;
  authenticityNote: string;
  curatorNote?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refunded";

export const STEPPER_STATES: OrderStatus[] = [
  "pending",
  "paid",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

export interface OrderItem {
  sareeId: string;
  slug: string;
  title: LocalizedText;
  priceInPaise: MoneyPaise;
  imageId: string;
}

export interface Address {
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Customer {
  name: string;
  phone: string;
  email?: string;
}

export interface PaymentDetails {
  method: "upi" | "cod" | "card" | "netbanking";
  provider: "razorpay" | "cod";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paidAt?: string;
}

export interface ShipmentDetails {
  courier: string;
  awb: string;
  trackingUrl: string;
  shippedAt: string;
  estimatedDelivery: string;
}

export interface TimelineEntry {
  status: OrderStatus;
  at: string;
  note?: string;
  carrierEventId?: string;
}

export interface Order {
  id: string;
  reference: string;
  status: OrderStatus;
  items: OrderItem[];
  totals: {
    subtotalInPaise: MoneyPaise;
    discountInPaise?: MoneyPaise;
    shippingInPaise: MoneyPaise;
    totalInPaise: MoneyPaise;
  };
  appliedCoupon?: string;
  customer: Customer;
  address: Address;
  payment: PaymentDetails;
  shipment?: ShipmentDetails;
  timeline: TimelineEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface InventoryLock {
  sareeId: string;
  cartId: string;
  expiresAt: string;
}

export interface Offer {
  id: string;
  code: string;
  title: LocalizedText;
  description: LocalizedText;
  discountType: "percentage" | "fixed_paise" | "free_shipping";
  discountValue: number;
  minCartValueInPaise?: MoneyPaise;
  maxDiscountInPaise?: MoneyPaise;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  bannerText?: LocalizedText;
  usageLimit?: number;
  usageCount: number;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  orderReference: string;
  amountInPaise: MoneyPaise;
  currency: Currency;
  method: "upi" | "cod" | "card" | "netbanking";
  status: "initiated" | "captured" | "failed" | "refunded";
  gatewayProvider: "razorpay" | "cod";
  gatewayPaymentId?: string;
  gatewayOrderId?: string;
  failureReason?: string;
  customerPhone: string;
  createdAt: string;
}

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };
