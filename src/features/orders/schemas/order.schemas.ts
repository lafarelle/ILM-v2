import { z } from "zod";

export const OrderIdSchema = z.string().uuid();

export const OrdersFilterSchema = z
  .object({
    status: z
      .enum(["PENDING", "REQUIRES_PAYMENT", "PAID", "CANCELED", "REFUNDED"])
      .optional(),
  })
  .optional();

export type OrderIdInput = z.infer<typeof OrderIdSchema>;

export const CheckoutContactSchema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  phone: z
    .string()
    .min(6)
    .max(30)
    .regex(/^[0-9+()\-\s]+$/),
  location: z.string().min(3).max(200),
});

// Backward-compat alias (can be removed once all imports are updated)
export const GuestCheckoutSchema = CheckoutContactSchema;

export interface CheckoutContactInput
  extends z.infer<typeof CheckoutContactSchema> {}
