"use server";

import { ActionResult } from "@/model/domain/types";
import { adminDb } from "@/infrastructure/firebase/admin";

export async function verifyTrackingAccess(
  reference: string,
  phoneLast4: string
): Promise<ActionResult<{ verified: boolean }>> {
  const snap = await adminDb.collection("orders").where("reference", "==", reference.toUpperCase()).limit(1).get();

  if (snap.empty) {
    return { ok: false, error: { code: "ORDER_NOT_FOUND", message: "Order reference not found" } };
  }

  const orderData = snap.docs[0].data();
  const phone = orderData.customer?.phone || "";

  if (phone.endsWith(phoneLast4)) {
    return { ok: true, data: { verified: true } };
  }

  return {
    ok: false,
    error: { code: "VERIFICATION_FAILED", message: "Phone number verification failed. Please check the last 4 digits." },
  };
}
