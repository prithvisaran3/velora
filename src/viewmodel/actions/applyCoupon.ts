"use server";

import { ActionResult, paise, MoneyPaise } from "@/model/domain/types";
import { container } from "@/infrastructure/container";

export interface CouponDiscountResult {
  code: string;
  discountInPaise: MoneyPaise;
  description: string;
}

export async function applyCoupon(
  code: string,
  subtotalInPaise: number
): Promise<ActionResult<CouponDiscountResult>> {
  const offer = await container.offerRepository.getByCode(code);

  if (!offer || !offer.isActive) {
    return {
      ok: false,
      error: { code: "INVALID_COUPON", message: "This offer code is invalid or has expired." },
    };
  }

  const now = new Date().toISOString();
  if (offer.validFrom > now || offer.validUntil < now) {
    return {
      ok: false,
      error: { code: "EXPIRED_COUPON", message: "This offer code is no longer valid." },
    };
  }

  if (offer.minCartValueInPaise && subtotalInPaise < offer.minCartValueInPaise) {
    const minRupees = Math.round(offer.minCartValueInPaise / 100);
    return {
      ok: false,
      error: {
        code: "MIN_VALUE_NOT_MET",
        message: `This coupon requires a minimum cart value of ₹${minRupees.toLocaleString("en-IN")}.`,
      },
    };
  }

  let discountPaise = 0;
  if (offer.discountType === "percentage") {
    discountPaise = Math.round((subtotalInPaise * offer.discountValue) / 100);
  } else if (offer.discountType === "fixed_paise") {
    discountPaise = offer.discountValue * 100;
  } else if (offer.discountType === "free_shipping") {
    discountPaise = 0;
  }

  if (discountPaise > subtotalInPaise) {
    discountPaise = subtotalInPaise;
  }

  return {
    ok: true,
    data: {
      code: offer.code,
      discountInPaise: paise(discountPaise),
      description: offer.title.en,
    },
  };
}
