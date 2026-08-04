import { NextResponse } from "next/server";
import { adminDb } from "@/infrastructure/firebase/admin";
import { OrderStatus, Order } from "@/model/domain/types";
import { transitionOrderStatus } from "@/model/service/orderStateMachine";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { order_id, current_status, awb } = payload;

    if (!order_id || !current_status) {
      return NextResponse.json({ ok: false, error: "Missing order_id or current_status" }, { status: 400 });
    }

    const ordersSnap = await adminDb.collection("orders").where("reference", "==", order_id.toUpperCase()).limit(1).get();
    if (ordersSnap.empty) {
      return NextResponse.json({ ok: false, error: `Order ${order_id} not found` }, { status: 404 });
    }

    const orderDoc = ordersSnap.docs[0];
    const order = orderDoc.data() as Order;

    const statusUpper = current_status.toUpperCase();
    let targetStatus: OrderStatus | null = null;

    if (statusUpper.includes("PICK") || statusUpper.includes("TRANSIT") || statusUpper.includes("SHIPPED")) {
      targetStatus = "shipped";
    } else if (statusUpper.includes("OUT FOR DELIVERY")) {
      targetStatus = "out_for_delivery";
    } else if (statusUpper.includes("DELIVERED")) {
      targetStatus = "delivered";
    }

    if (targetStatus && targetStatus !== order.status) {
      try {
        const { newStatus, entry } = transitionOrderStatus(order.status, targetStatus, `Carrier status: ${current_status}`, awb);

        await orderDoc.ref.update({
          status: newStatus,
          timeline: [...order.timeline, entry],
          updatedAt: new Date().toISOString(),
        });
      } catch (e: any) {
        console.warn("[State Transition Skipped]", e.message);
      }
    }

    return NextResponse.json({ ok: true, order_id, current_status });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
