import { z } from "zod";

export const addressInputSchema = z.object({
  line1: z.string().min(5, "Address line 1 is required"),
  line2: z.string().optional(),
  landmark: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
});

export const customerInputSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  email: z.string().email().optional().or(z.literal("")),
});

export const orderInputSchema = z.object({
  sareeId: z.string().min(1),
  customer: customerInputSchema,
  address: addressInputSchema,
  paymentMethod: z.enum(["upi", "cod", "card", "netbanking"]),
});

export type OrderInput = z.infer<typeof orderInputSchema>;
