import { container } from "@/infrastructure/container";
import { Order } from "@/model/domain/types";
import { configFixture } from "@/model/fixtures/config.fixture";

export interface OrderTrackingViewModel {
  order: Order;
  config: typeof configFixture;
}

export async function getOrderTrackingVM(
  reference: string,
  phoneLast4?: string
): Promise<OrderTrackingViewModel | null> {
  const order = phoneLast4
    ? await container.orderRepository.getByReferenceAndPhoneLast4(reference, phoneLast4)
    : await container.orderRepository.getByReference(reference);

  if (!order) return null;

  return {
    order,
    config: configFixture,
  };
}
