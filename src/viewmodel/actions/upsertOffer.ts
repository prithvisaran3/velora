"use server";

import { offerInputSchema } from "@/model/schema/offer.schema";
import { ActionResult, Offer, paise } from "@/model/domain/types";
import { container } from "@/infrastructure/container";

export async function upsertOffer(input: unknown): Promise<ActionResult<Offer>> {
  const parsed = offerInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: parsed.error.issues.map((i) => i.message).join(", "),
      },
    };
  }

  const data = parsed.data;
  const id = `off-${Date.now()}`;

  const offer: Offer = {
    id,
    code: data.code,
    title: { en: data.titleEn, ta: data.titleTa },
    description: { en: data.descriptionEn, ta: data.descriptionTa },
    discountType: data.discountType,
    discountValue: data.discountValue,
    minCartValueInPaise: data.minCartValueInRupees ? paise(data.minCartValueInRupees * 100) : undefined,
    validFrom: data.validFrom,
    validUntil: data.validUntil,
    isActive: data.isActive,
    bannerText: data.bannerTextEn && data.bannerTextTa ? { en: data.bannerTextEn, ta: data.bannerTextTa } : undefined,
    usageCount: 0,
    createdAt: new Date().toISOString(),
  };

  await container.offerRepository.saveOffer(offer);
  return { ok: true, data: offer };
}
