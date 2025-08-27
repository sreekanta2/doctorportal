// app/actions/specialization.ts
"use server";

import {
  serverActionCreatedResponse,
  serverActionErrorResponse,
  serverActionSuccessResponse,
} from "@/lib/actions/server-actions-response";
import prisma from "@/lib/db";
import {
  CreateSpecializationInput,
  createSpecializationSchema,
  UpdateSpecializationInput,
  updateSpecializationSchema,
} from "@/zod-validation/specialties";
import { revalidatePath } from "next/cache";

/**
 * Create Specialization
 */
export async function createSpecialization(data: CreateSpecializationInput) {
  const parsed = createSpecializationSchema.parse(data);

  try {
    const totalDoctors = await prisma.doctor.count({
      where: {
        specialization: parsed.name,
      },
    });

    const specialization = await prisma.specialization.create({
      data: { ...parsed, totalDoctors: totalDoctors || 0 },
    });
    revalidatePath(`/admin/specialties`);
    return serverActionCreatedResponse(specialization);
  } catch (error: any) {
    return serverActionErrorResponse(error);
  }
}

/**
 * Update Specialization
 */
export async function updateSpecialization(data: UpdateSpecializationInput) {
  const parsed = updateSpecializationSchema.parse(data);

  try {
    const totalDoctors = await prisma.doctor.count({
      where: {
        specialization: parsed.name,
      },
    });

    const specialization = await prisma.specialization.update({
      where: { id: parsed.id },
      data: {
        ...parsed,
        totalDoctors: totalDoctors || 0,
      },
    });
    revalidatePath(`/admin/specialties`);

    return serverActionSuccessResponse(specialization);
  } catch (error: any) {
    return serverActionErrorResponse(error);
  }
}

/**
 * Delete Specialization
 */
export async function deleteSpecialization(id: string) {
  try {
    const specialization = await prisma.specialization.delete({
      where: { id },
    });

    revalidatePath(`/admin/specialties`);
    return serverActionSuccessResponse(specialization);
  } catch (error: any) {
    return serverActionErrorResponse(error);
  }
}
