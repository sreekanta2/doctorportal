"use server";
import { AppError } from "@/lib/actions/actions-error-response";
import {
  serverActionCreatedResponse,
  serverActionErrorResponse,
  ServerActionResponse,
  serverActionSuccessResponse,
} from "@/lib/actions/server-actions-response";
import prisma from "@/lib/db";
import { createClinicMembershipSchema } from "@/zod-validation/membership";
import { SubscriptionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createClinicMembershipCheckSubscription = async (
  data: z.infer<typeof createClinicMembershipSchema>
) => {
  try {
    const validatedData = createClinicMembershipSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { id: validatedData.clinicId },
      include: { clinic: true },
    });

    if (!existingUser?.clinic?.id) {
      throw new AppError("Complete clinic profile first", 400);
    }
    const clinicId = existingUser.clinic.id;

    // Check clinic subscription
    const subscription = await prisma.subscription.findUnique({
      where: { clinicId },
      include: {
        pricePlan: true,
      },
    });

    const uniqueDoctorCount = await prisma.clinicMembership.groupBy({
      by: ["doctorId"],
      where: { clinicId },
      _count: { doctorId: true },
    });
    const count = uniqueDoctorCount.length;

    if (!subscription && count === 0) {
      const pricingPlan = await prisma.pricePlan.findUnique({
        where: { plan: "PREMIUM" },
      });
      if (!pricingPlan) {
        throw new AppError("Create pricing plan ", 500);
      }
      const subscriptionData = {
        clinicId,
        pricePlanId: pricingPlan?.id,
        status: SubscriptionStatus.ACTIVE,
        bkashNumber: "01****",
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        transactionId: "tranid",
        startDate: new Date(),
      };
      await prisma.subscription.create({
        data: subscriptionData,
      });
    }
    if (subscription) {
      if (subscription.status === "INACTIVE") {
        throw new AppError("Your order is pending!");
      }
      if (subscription?.endDate < new Date()) {
        throw new AppError("You  subscription plan expire !");
      }
      if (subscription?.endDate > new Date()) {
        if (count >= subscription?.pricePlan?.maxDoctors) {
          throw new AppError("You added  max doctor upgrade the plan !");
        }
      }
    }

    const existingMembership = await prisma.clinicMembership.findFirst({
      where: { doctorId: validatedData.doctorId, clinicId },
    });
    if (existingMembership) {
      throw new AppError("This doctor is already a member of your clinic", 400);
    }
    const newMembership = await prisma.clinicMembership.create({
      data: { ...validatedData, clinicId },
    });
    revalidatePath("/clinic/doctors");

    return serverActionCreatedResponse(
      { membership: newMembership },
      { message: "Membership created successfully!" }
    );
  } catch (error) {
    return serverActionErrorResponse(error);
  }
};

export const deleteMembership = async (
  id: string
): Promise<ServerActionResponse<any>> => {
  try {
    // 1. Check if the membership exists.
    const existingMembership = await prisma.clinicMembership.findUnique({
      where: { id },
    });

    // 2. Handle case where membership is not found.
    if (!existingMembership) {
      return serverActionErrorResponse("Membership not found");
    }

    // 3. Delete the membership.
    await prisma.clinicMembership.delete({
      where: { id },
    });
    revalidatePath("/clinic/doctors");
    // 4. Return success response. For deletes, data can often be `null` or a confirmation message.
    return serverActionSuccessResponse(null, {
      message: "Clinic membership deleted successfully.",
    });
  } catch (error) {
    // 5. Centralized error handling.
    return serverActionErrorResponse(error);
  }
};
