import { SareeRepository } from "@/model/repository/sareeRepository";
import { OrderRepository } from "@/model/repository/orderRepository";
import { Saree, Order, ColourKey, OccasionKey, Offer, PaymentRecord, paise } from "@/model/domain/types";
import { sareesFixture } from "@/model/fixtures/sarees";

// Client-safe repository implementations
class ClientSareeRepository implements SareeRepository {
  async listAll(): Promise<Saree[]> {
    return sareesFixture;
  }
  async listAvailable(): Promise<Saree[]> {
    return sareesFixture.filter((s) => s.status === "available");
  }
  async listByColour(colour: ColourKey): Promise<Saree[]> {
    return sareesFixture.filter((s) => s.colour.key === colour);
  }
  async listByOccasion(occasion: OccasionKey): Promise<Saree[]> {
    return sareesFixture.filter((s) => s.occasions.includes(occasion));
  }
  async listLatest(limitCount = 8): Promise<Saree[]> {
    return sareesFixture.slice(0, limitCount);
  }
  async getBySlug(slug: string): Promise<Saree | null> {
    return sareesFixture.find((s) => s.slug === slug) || null;
  }
  async getById(id: string): Promise<Saree | null> {
    return sareesFixture.find((s) => s.id === id) || null;
  }
  async listRelated(sareeId: string, limitCount = 4): Promise<Saree[]> {
    return sareesFixture.filter((s) => s.id !== sareeId).slice(0, limitCount);
  }
}

class ClientOrderRepository implements OrderRepository {
  async getByReference(reference: string): Promise<Order | null> {
    return {
      id: "ord-4821",
      reference: reference.toUpperCase(),
      status: "shipped",
      items: [
        {
          sareeId: sareesFixture[0].id,
          slug: sareesFixture[0].slug,
          title: sareesFixture[0].title,
          priceInPaise: sareesFixture[0].priceInPaise,
          imageId: sareesFixture[0].images[0].id,
        },
      ],
      totals: {
        subtotalInPaise: sareesFixture[0].priceInPaise,
        shippingInPaise: paise(0),
        totalInPaise: sareesFixture[0].priceInPaise,
      },
      customer: { name: "Ananya Sundaram", phone: "9876543210" },
      address: { line1: "42 Heritage Enclave", city: "Coimbatore", state: "Tamil Nadu", pincode: "641018" },
      payment: { method: "upi", provider: "razorpay" },
      shipment: {
        courier: "BlueDart Express",
        awb: "SR19784821IN",
        trackingUrl: "https://bluedart.com",
        shippedAt: "2026-08-03T10:00:00Z",
        estimatedDelivery: "Thursday, 6 August",
      },
      timeline: [
        { status: "pending", at: "2026-08-03T09:00:00Z", note: "Order placed" },
        { status: "paid", at: "2026-08-03T09:02:00Z", note: "UPI Payment captured" },
        { status: "packed", at: "2026-08-03T09:30:00Z", note: "Packed in Erode shop" },
        { status: "shipped", at: "2026-08-03T10:00:00Z", note: "Dispatched via BlueDart" },
      ],
      createdAt: "2026-08-03T09:00:00Z",
      updatedAt: "2026-08-03T10:00:00Z",
    };
  }

  async getByReferenceAndPhoneLast4(reference: string, phoneLast4: string): Promise<Order | null> {
    return this.getByReference(reference);
  }

  async createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
    return {
      ...orderData,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

class ClientOfferRepository {
  async listActive(): Promise<Offer[]> {
    return [
      {
        id: "off-01",
        code: "FESTIVE500",
        title: { en: "Festive Curation Special", ta: "விழா சிறப்பு தள்ளுபடி" },
        description: { en: "Flat ₹500 discount on handpicked silk sarees.", ta: "இன்று பட்டுப்புடவைகள் வாங்கும் போது ₹500 தள்ளுபடி." },
        discountType: "fixed_paise",
        discountValue: 500,
        validFrom: "2026-01-01",
        validUntil: "2026-12-31",
        isActive: true,
        usageCount: 0,
        createdAt: "2026-01-01",
      },
    ];
  }

  async getByCode(code: string): Promise<Offer | null> {
    const list = await this.listActive();
    return list.find((o) => o.code === code.toUpperCase()) || null;
  }

  async saveOffer(offer: Offer): Promise<Offer> {
    return offer;
  }
}

class ClientPaymentRepository {
  async listRecent(): Promise<PaymentRecord[]> {
    return [];
  }
  async recordPayment(payment: PaymentRecord): Promise<PaymentRecord> {
    return payment;
  }
}

export interface Container {
  sareeRepository: SareeRepository;
  orderRepository: OrderRepository;
  offerRepository: ClientOfferRepository;
  paymentRepository: ClientPaymentRepository;
}

class DefaultContainer implements Container {
  public sareeRepository: SareeRepository = new ClientSareeRepository();
  public orderRepository: OrderRepository = new ClientOrderRepository();
  public offerRepository = new ClientOfferRepository();
  public paymentRepository = new ClientPaymentRepository();
}

export const container: Container = new DefaultContainer();
