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
      where: { email: validatedData.email, role: "clinic" },
      select: {
        id: true,
        email: true,
        name: true,
        clinic: { select: { id: true } },
      },
    });

    if (!clinicUser) {
      throw new AppError("Only for Clinic user!", 404);
    }

    if (!clinicUser.clinic?.id) {
      throw new AppError("User is not linked to a clinic", 400);
    }

    const clinicId = clinicUser.clinic.id;

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
      } else {
        // Create new subscription
        return tx.subscription.create({
          data: {
            clinicId,
            pricePlanId: validatedData.pricePlanId,
            status: "INACTIVE",
            bkashNumber: validatedData.bkashNumber,
            startDate: new Date(),
            endDate:
              validatedData?.endDate ||
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            transactionId: validatedData.transactionId,
          },
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
