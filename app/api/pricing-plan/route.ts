import { AppError } from "@/lib/actions/actions-error-response";
import { errorResponse, successResponse } from "@/lib/api/api-response";
import prisma from "@/lib/db";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const existingPlan = await prisma.pricePlan.findMany({});
    if (!existingPlan) {
      throw new AppError("Invalid pricing plan ", 401);
    }

    return successResponse(existingPlan);
  } catch (error) {
    return errorResponse(error); // <-- return response
  }
}
