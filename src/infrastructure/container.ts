import { SareeRepository } from "../model/repository/sareeRepository";
import { OrderRepository } from "../model/repository/orderRepository";
import { sareesFixture } from "../model/fixtures/sarees";
import { Saree, ColourKey, OccasionKey, Order } from "../model/domain/types";

class FixtureSareeRepository implements SareeRepository {
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
  async listLatest(limit = 8): Promise<Saree[]> {
    return sareesFixture.slice(0, limit);
  }
  async getBySlug(slug: string): Promise<Saree | null> {
    return sareesFixture.find((s) => s.slug === slug) || null;
  }
  async getById(id: string): Promise<Saree | null> {
    return sareesFixture.find((s) => s.id === id) || null;
  }
  async listRelated(sareeId: string, limit = 4): Promise<Saree[]> {
    const current = await this.getById(sareeId);
    if (!current) return sareesFixture.slice(0, limit);
    return sareesFixture
      .filter((s) => s.id !== sareeId && (s.colour.key === current.colour.key || s.occasions.some((o) => current.occasions.includes(o))))
      .slice(0, limit);
  }
}

class FixtureOrderRepository implements OrderRepository {
  private orders: Order[] = [
    {
      id: "ord-4821",
      reference: "VLR-4821",
      status: "shipped",
      items: [
        {
          sareeId: "vlr-001",
          slug: "deep-maroon-mangai-zari-silk",
          title: sareesFixture[0].title,
          priceInPaise: sareesFixture[0].priceInPaise,
          imageId: sareesFixture[0].images[0].id,
        },
      ],
      totals: {
        subtotalInPaise: sareesFixture[0].priceInPaise,
        shippingInPaise: 0 as any,
        totalInPaise: sareesFixture[0].priceInPaise,
      },
      customer: {
        name: "Ananya Sundaram",
        phone: "9876543210",
        email: "ananya@example.com",
      },
      address: {
        line1: "42 Heritage Enclave, Race Course",
        city: "Coimbatore",
        state: "Tamil Nadu",
        pincode: "641018",
      },
      payment: {
        method: "upi",
        provider: "razorpay",
        verifiedAt: "2026-08-02T14:30:00Z",
      },
      shipment: {
        provider: "shiprocket",
        awb: "SR19784821IN",
        courier: "BlueDart Express",
        expectedAt: "2026-08-05",
      },
      timeline: [
        { status: "paid", at: "2026-08-02T14:30:00Z", note: "Payment confirmed via UPI" },
        { status: "packed", at: "2026-08-03T09:15:00Z", note: "Handpacked at Erode showroom" },
        { status: "shipped", at: "2026-08-03T14:00:00Z", note: "Dispatched via BlueDart Express" },
      ],
      createdAt: "2026-08-02T14:28:00Z",
      updatedAt: "2026-08-03T14:00:00Z",
    },
  ];

  async getByReference(reference: string): Promise<Order | null> {
    return this.orders.find((o) => o.reference.toUpperCase() === reference.toUpperCase()) || null;
  }

  async getByReferenceAndPhoneLast4(reference: string, phoneLast4: string): Promise<Order | null> {
    const order = await this.getByReference(reference);
    if (!order) return null;
    if (order.customer.phone.endsWith(phoneLast4)) {
      return order;
    }
    return null;
  }

  async createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.orders.push(newOrder);
    return newOrder;
  }
}

export const container = {
  sareeRepository: new FixtureSareeRepository(),
  orderRepository: new FixtureOrderRepository(),
};
