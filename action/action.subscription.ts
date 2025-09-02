"use server";

import { AppError } from "@/lib/actions/actions-error-response";
import {
  serverActionCreatedResponse,
  serverActionErrorResponse,
} from "@/lib/actions/server-actions-response";
import prisma from "@/lib/db";

import {
  CreateSubscriptionInput,
  SubscriptionBaseSchema,
  UpdateSubscriptionInput,
} from "@/zod-validation/subscription";
import { revalidatePath } from "next/cache";

export async function createOrUpdateSubscription(
  data: CreateSubscriptionInput | UpdateSubscriptionInput
) {
  try {
    // ✅ Validate request body with Zod
    const validatedData = SubscriptionBaseSchema.parse(data);

    // ✅ Verify clinic user exists
    const clinicUser = await prisma.user.findFirst({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        name: true,
        clinic: { select: { id: true } },
      },
    });
    if (!clinicUser?.clinic?.id) {
      throw new AppError("Only for Clinic user!", 404);
    }

    const clinicId = clinicUser?.clinic?.id;

    // ✅ Handle subscription in a transaction to prevent race conditions
    const subscription = await prisma.$transaction(async (tx) => {
      // Check if subscription exists for this clinic
      const existingSubscription = await tx.subscription.findUnique({
        where: { clinicId },
      });

      const subscriptionData = {
        clinicId,
        pricePlanId: validatedData.pricePlanId,
        status: validatedData?.status, // stays inactive until payment verified
        bkashNumber: validatedData.bkashNumber,
        endDate: validatedData?.endDate,
        transactionId: validatedData.transactionId,
      };

      if (existingSubscription) {
        // Renew/Update subscription
        return tx.subscription.update({
          where: { id: existingSubscription?.id },
          data: subscriptionData,
        });
      }
    });
    revalidatePath("admin/subscriptions");
    // ✅ Return standard success response
    return serverActionCreatedResponse(subscription);
  } catch (error: any) {
    console.error("createSubscription Error:", error.message);
    return serverActionErrorResponse(error);
  }
}
