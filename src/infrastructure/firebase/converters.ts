import { FirestoreDataConverter } from "firebase/firestore";
import { Saree, Order, InventoryLock } from "@/model/domain/types";

export const sareeConverter: FirestoreDataConverter<Saree> = {
  toFirestore(saree: Saree) {
    return {
      slug: saree.slug,
      title: saree.title,
      priceInPaise: saree.priceInPaise,
      status: saree.status,
      colour: saree.colour,
      occasions: saree.occasions,
      fabric: saree.fabric,
      lengthCm: saree.lengthCm,
      blousePieceCm: saree.blousePieceCm,
      zari: saree.zari,
      care: saree.care,
      weightGrams: saree.weightGrams,
      images: saree.images,
      drapeVideo: saree.drapeVideo || null,
      authenticityNote: saree.authenticityNote,
      curatorNote: saree.curatorNote || null,
      publishedAt: saree.publishedAt || null,
      createdAt: saree.createdAt,
      updatedAt: saree.updatedAt,
    };
  },
  fromFirestore(snapshot, options): Saree {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      slug: data.slug,
      title: data.title,
      priceInPaise: data.priceInPaise,
      status: data.status,
      colour: data.colour,
      occasions: data.occasions,
      fabric: data.fabric,
      lengthCm: data.lengthCm,
      blousePieceCm: data.blousePieceCm,
      zari: data.zari,
      care: data.care,
      weightGrams: data.weightGrams,
      images: data.images,
      drapeVideo: data.drapeVideo || undefined,
      authenticityNote: data.authenticityNote,
      curatorNote: data.curatorNote || undefined,
      publishedAt: data.publishedAt || undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

export const orderConverter: FirestoreDataConverter<Order> = {
  toFirestore(order: Order) {
    return {
      reference: order.reference,
      status: order.status,
      items: order.items,
      totals: order.totals,
      customer: order.customer,
      address: order.address,
      payment: order.payment,
      shipment: order.shipment || null,
      timeline: order.timeline,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  },
  fromFirestore(snapshot, options): Order {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      reference: data.reference,
      status: data.status,
      items: data.items,
      totals: data.totals,
      customer: data.customer,
      address: data.address,
      payment: data.payment,
      shipment: data.shipment || undefined,
      timeline: data.timeline,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};
