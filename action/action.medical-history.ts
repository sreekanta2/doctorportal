// actions/medicalHistory.actions.ts
"use server";

import { AppError } from "@/lib/actions/actions-error-response";
import {
  serverActionCreatedResponse,
  serverActionErrorResponse,
  serverActionSuccessResponse,
} from "@/lib/actions/server-actions-response";
import prisma from "@/lib/db";
import {
  medicalHistoryCreateSchema,
  medicalHistoryUpdateSchema,
} from "@/zod-validation/medical-history";

import { revalidatePath } from "next/cache";

export async function createMedicalHistory(values: unknown) {
  try {
    const data = medicalHistoryCreateSchema.parse(values);
    if (!data.patientId) {
      throw new Error("Doctor ID and Patient ID are required");
    }

    const exitingPatient = await prisma.user.findUnique({
      where: { id: data.patientId },
      include: { patient: true },
    });

    if (!exitingPatient) {
      throw new AppError("Patient not found");
    }

    const pastAppointment = await prisma.pastAppointment.findFirst({
      where: {
        doctorId: data.doctorId,
        patientId: exitingPatient.patient?.id,
      },
    });

    if (!pastAppointment) {
      throw new AppError("Past appointment not found");
    }

    const medicalHistoryData = {
      title: data.title,
      description: data.description,
      date: data.date,
      document: data.document,
      pastAppointmentId: pastAppointment.id,
      patientId: pastAppointment?.patientId,
    };
    const history = await prisma.medicalHistory.create({
      data: {
        ...medicalHistoryData,
      },
    });

    revalidatePath("/patient/dashboard");
    return serverActionCreatedResponse(history);
  } catch (error: any) {
    return serverActionErrorResponse(
      error.message || "Failed to create medical history"
    );
  }
}

export async function updateMedicalHistory(values: unknown) {
  try {
    const data = medicalHistoryUpdateSchema.parse(values);

    const history = await prisma.medicalHistory.update({
      where: { id: data?.id },
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

    revalidatePath("/patient/dashboard");
    return serverActionSuccessResponse(null);
  } catch (error: any) {
    return serverActionErrorResponse(
      error.message || "Failed to delete medical history"
    );
  }
}
