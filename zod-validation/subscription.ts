import { z } from "zod";
import { SubscriptionStatus } from "./enum";

export const SubscriptionBaseSchema = z.object({
  pricePlanId: z.string().min(1, "Price Plan ID is required"),
  transactionId: z.string().min(6, "TransactionId required"),
  bkashNumber: z.string().min(11, " Please enter your bkash number"),
  email: z.string().email("Email is required"),
  status: SubscriptionStatus,
  startDate: z.coerce.date({ required_error: "Date is required" }).optional(),
  endDate: z.coerce.date({ required_error: "Date is required" }),
});

// ✅ Schema for creating
export const CreateSubscriptionSchema = SubscriptionBaseSchema;

// ✅ Schema for updating
export const UpdateSubscriptionSchema = SubscriptionBaseSchema.partial().extend(
  {
    id: z.string().min(1, "Subscription ID is required"),
  }
);

// ✅ Input Types
export type CreateSubscriptionInput = z.infer<typeof CreateSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof UpdateSubscriptionSchema>;
