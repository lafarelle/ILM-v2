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
