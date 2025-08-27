"use server";
import { AppError } from "@/lib/actions/actions-error-response";
import {
  serverActionCreatedResponse,
  serverActionErrorResponse,
} from "@/lib/actions/server-actions-response";
import prisma from "@/lib/db";
import { UpdatePatientInput } from "@/zod-validation/patient";

import { revalidatePath } from "next/cache";
export async function updateUserAndPatientAction(
  data: UpdatePatientInput,
  path: string | null
) {
  try {
    if (!data.id) {
      throw new AppError("Patient ID is required for update", 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update User
      const user = await tx.user.update({
        where: { email: data.email },
        data: {
          name: data.name,
          email: data.email,
          role: data.role,
          image: data.image,
        },
      });

      // Upsert Patient (update if exists, else create)
      const patient = await tx.patient.upsert({
        where: { userId: user.id },
        update: {
          age: data.age,
          gender: data.gender,
          bloodGroup: data.bloodGroup,
          phoneNumber: data.phoneNumber,
          street: data.street,
          city: data.city,
          country: data.country,
          zipCode: data.zipCode,
        },
        create: {
          userId: user.id,
          age: data.age,
          gender: data.gender,
          bloodGroup: data.bloodGroup,
          phoneNumber: data.phoneNumber,
          street: data.street,
          city: data.city,
          country: data.country,
          zipCode: data.zipCode,
        },
      });

      return { user, patient };
    });

    revalidatePath(path || "/");

    return serverActionCreatedResponse(result);
  } catch (error: any) {
    console.error("❌ updateUserAndPatientAction error:", error);
    return serverActionErrorResponse(
      error.message || "Failed to update or create patient"
    );
  }
}

export async function deletePatient(email: string) {
  try {
    if (!email) {
      throw new AppError("Patient email is required for deletion", 400);
    }

    await prisma.user.delete({
      where: { email: email },
    });
    revalidatePath("/admin/patients");
    return serverActionCreatedResponse({
      message: "Patient deleted successfully",
    });
  } catch (error: any) {
    console.error("❌ deletePatient error:", error);
    return serverActionErrorResponse(
      error.message || "Failed to delete patient"
    );
  }
}
