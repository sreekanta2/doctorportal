import { AppError } from "@/lib/actions/actions-error-response";
import { errorResponse, successResponse } from "@/lib/api/api-response";
import prisma from "@/lib/db";

import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    const patientId = params.patientId;

    if (!patientId) {
      throw new AppError("Patient ID is required", 400);
    }
    const existingPatient = await prisma.patient.findUnique({
      where: { userId: patientId },
      include: {
        user: true,
      },
    });

    if (!existingPatient) {
      throw new AppError("Patient not found", 404);
    }

    return successResponse(existingPatient, {
      message: "Patient profile retrieve successfully",
    });
  } catch (error) {
    return errorResponse(error);
  }
}
