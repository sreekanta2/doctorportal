import { AppError } from "@/lib/actions/actions-error-response";
import { errorResponse, successResponse } from "@/lib/api/api-response";
import prisma from "@/lib/db";

import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    if (!userId) {
      throw new AppError("User ID is required", 400);
    }
    const existingUser = await prisma.clinic.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });

    if (!existingUser) {
      throw new AppError("Clinic not found", 404);
    }

    return successResponse(existingUser, {
      message: "Clinic profile retrieve successfully",
    });
  } catch (error) {
    return errorResponse(error);
  }
}
