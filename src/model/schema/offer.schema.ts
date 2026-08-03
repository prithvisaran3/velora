import { z } from "zod";

export const offerInputSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").toUpperCase(),
  titleEn: z.string().min(3, "Title EN is required"),
  titleTa: z.string().min(2, "Title TA is required"),
  descriptionEn: z.string().min(5, "Description EN is required"),
  descriptionTa: z.string().min(2, "Description TA is required"),
  discountType: z.enum(["percentage", "fixed_paise", "free_shipping"]),
  discountValue: z.number().nonnegative(),
  minCartValueInRupees: z.number().optional(),
  validFrom: z.string(),
  validUntil: z.string(),
  isActive: z.boolean().default(true),
  bannerTextEn: z.string().optional(),
  bannerTextTa: z.string().optional(),
});

export type OfferInput = z.infer<typeof offerInputSchema>;
