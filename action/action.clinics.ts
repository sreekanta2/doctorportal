"use server";
import bcrypt from "bcryptjs";

import {
  serverActionCreatedResponse,
  serverActionErrorResponse,
  serverActionSuccessResponse,
} from "@/lib/actions/server-actions-response";
import prisma from "@/lib/db";
import {
  baseClinicSchema,
  CreateClinicInput,
  UpdateClinicInput,
} from "@/zod-validation/clinic";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createOrUpdateUserAndClinicAction(
  data: CreateClinicInput | UpdateClinicInput,
  path: string | null = null
) {
  try {
    const validatedData = baseClinicSchema.parse(data);
    // Hash password if provided
    let hashedPassword: string | undefined;
    if (validatedData.password) {
      hashedPassword = await bcrypt.hash(validatedData.password, 10);
    }

    // Run transaction
    const result = await prisma.$transaction(async (tx) => {
      // 👉 Upsert User
      const user = await tx.user.upsert({
        where: { email: validatedData.email },
        update: {
          name: validatedData.name,
          email: validatedData.email,
          ...(hashedPassword && { password: hashedPassword }),
          role: validatedData.role,
          image: validatedData.image,
        },
        create: {
          name: validatedData.name,
          email: validatedData.email,
          password: hashedPassword || (await bcrypt.hash("Default@123", 10)),
          role: validatedData.role,
          image: validatedData.image,
        },
      });

      // 👉 Upsert Clinic
      const clinic = await tx.clinic.upsert({
        where: { userId: user.id },
        update: {
          phoneNumber: validatedData.phoneNumber,
          description: validatedData.description,
          openingHour: validatedData.openingHour,
          establishedYear: validatedData.establishedYear,
          street: validatedData.street,
          city: validatedData.city,
          country: validatedData.country,
          zipCode: validatedData.zipCode,
        },
        create: {
          phoneNumber: validatedData.phoneNumber,
          description: validatedData.description,
          openingHour: validatedData.openingHour,
          establishedYear: validatedData.establishedYear,
          street: validatedData.street,
          city: validatedData.city,
          country: validatedData.country,
          zipCode: validatedData.zipCode,
          userId: user.id,
        },
      });

      return { user, clinic };
    });

    revalidatePath(path || "/clinics");

    return serverActionCreatedResponse(result);
  } catch (error: any) {
    console.error("❌ createOrUpdateUserAndClinicAction error:", error);
    return serverActionErrorResponse(
      error.message || "Failed to create or update user and clinic"
    );
  }
}
export async function deleteClinic(email: string) {
  try {
    // Validate incoming data
    const validatedEmail = z.string().email().parse(email);

    // Fetch existing clinic
    const clinic = await prisma.user.findUnique({
      where: { email: validatedEmail },
      include: { clinic: true },
    });

    if (!clinic) return serverActionErrorResponse("Clinic not found");

    // Delete clinic profile
    await prisma.user.delete({
      where: { email: validatedEmail },
    });

    // Revalidate clinics list page
    revalidatePath("/admin/clinics");

    return serverActionSuccessResponse({
      message: " Clinic deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return serverActionErrorResponse(error);
  }
}
