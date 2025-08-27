// actions/medicalHistory.actions.ts
"use server";

import { AppError } from "@/lib/actions/actions-error-response";
import {
  serverActionCreatedResponse,
  serverActionErrorResponse,
  serverActionSuccessResponse,
} from "@/lib/actions/server-actions-response";
import prisma from "@/lib/db";
import { medicalHistoryUpdateSchema } from "@/zod-validation/medical-history";
import { passAppointmentCreateSchema } from "@/zod-validation/pastAppointment";

import { revalidatePath } from "next/cache";

export async function createPastAppointment(values: unknown) {
  try {
    const data = passAppointmentCreateSchema.parse(values);
    if (!data.doctorId || !data.patientId) {
      throw new Error("Doctor ID and Patient ID are required");
    }

    const exitingPatient = await prisma.user.findUnique({
      where: { id: data.patientId },
      include: { patient: true },
    });

    if (!exitingPatient?.patient) {
      throw new AppError("Setup patient information first");
    }
    let pastAppointment = await prisma.pastAppointment.findFirst({
      where: {
        patientId: exitingPatient?.patient?.id,
        doctorId: data?.doctorId,
      },
    });

    if (!pastAppointment) {
      pastAppointment = await prisma.pastAppointment.create({
        data: {
          patientId: exitingPatient?.patient?.id,
          doctorId: data?.doctorId,
        },
      });
    }

    revalidatePath("/patient/dashboard");
    return serverActionCreatedResponse(pastAppointment);
  } catch (error: any) {
    return serverActionErrorResponse(
      error || "Failed to create medical history"
    );
  }
}

export async function updateMedicalHistory(id: string, values: unknown) {
  try {
    if (!id) return serverActionErrorResponse("ID is required");

    const data = medicalHistoryUpdateSchema.parse(values);

    const history = await prisma.medicalHistory.update({
      where: { id },
      data,
    });

    revalidatePath("/patient/medical-history");
    return serverActionSuccessResponse(history);
  } catch (error: any) {
    return serverActionErrorResponse(
      error.message || "Failed to update medical history"
    );
  }
}

export async function deleteMedicalHistory(id: string) {
  try {
    if (!id) return serverActionErrorResponse("ID is required");
    const history = await prisma.medicalHistory.findUnique({
      where: { id },
    });
    if (!history) return serverActionErrorResponse("Medical history not found");

    await prisma.medicalHistory.delete({
      where: { id },
    });

    revalidatePath("/patient/medical-history");
    return serverActionSuccessResponse(null);
  } catch (error: any) {
    return serverActionErrorResponse(
      error.message || "Failed to delete medical history"
    );
  }
}
