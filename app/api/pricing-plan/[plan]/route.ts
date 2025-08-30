import { AppError } from "@/lib/actions/actions-error-response";
import { errorResponse, successResponse } from "@/lib/api/api-response";
import prisma from "@/lib/db";
import { PricingPlanType } from "@prisma/client";

import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { plan: PricingPlanType } }
) {
  try {
    const { plan } = params;
    if (!plan) {
      throw new AppError("Plan is required");
    }

    const existingPlan = await prisma.pricePlan.findUnique({
      where: { plan },
    });
    if (!existingPlan) {
      throw new AppError("Invalid pricing plan ", 401);
    }

    return successResponse(existingPlan);
  } catch (error) {
    return errorResponse(error); // <-- return response
  }
}
