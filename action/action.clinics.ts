"use server";
import bcrypt from "bcryptjs";

import {
  serverActionCreatedResponse,
  serverActionErrorResponse,
  serverActionSuccessResponse,
} from "@/lib/actions/server-actions-response";

import prisma from "@/lib/db";

import { AppError } from "@/lib/actions/actions-error-response";
import {
  baseClinicSchema,
  CreateClinicInput,
  UpdateClinicInput,
  updateClinicSchema,
} from "@/zod-validation/clinic";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ✅ CREATE
export async function createUserAndClinicAction(
  data: CreateClinicInput,
  path: string | null = null
) {
  try {
    const validatedData = baseClinicSchema.parse(data);

    // Hash password or fallback to default
    const hashedPassword =
      validatedData.password || (await bcrypt.hash("Default@123", 10));

    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          password: await bcrypt.hash(hashedPassword, 10),
          role: validatedData.role,
          image: validatedData.image,
        },
      });

      // Create clinic
      const clinic = await tx.clinic.create({
        data: {
          phoneNumber: validatedData.phoneNumber,
          description: validatedData.description,
          openingHour: validatedData.openingHour,
          establishedYear: validatedData.establishedYear,
          website: validatedData?.website,
          city: validatedData.city,
          country: validatedData.country,
          userId: user.id,
        },
      });

      return { user, clinic };
    });

    revalidatePath(path || "/clinics");
    return serverActionSuccessResponse(result);
  } catch (error: any) {
    console.error("❌ createUserAndClinicAction error:", error);
    return serverActionErrorResponse(
      error || "Failed to create user and clinic"
    );
  }
}

// ✅ UPDATE
export async function updateUserAndClinicAction(
  data: UpdateClinicInput,
  path: string | null
) {
  try {
    if (!data.email) {
      throw new AppError("Patient email is required for update", 400);
    }
    const validatedData = updateClinicSchema.parse(data);
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
      const clinic = await prisma.clinic.upsert({
        where: { userId: user.id },
        update: {
          phoneNumber: validatedData.phoneNumber,
          description: validatedData.description,
          openingHour: validatedData.openingHour,
          establishedYear: validatedData.establishedYear,
          website: validatedData?.website,

          city: validatedData.city,
          country: validatedData.country,
        },
        create: {
          userId: user.id,
          phoneNumber: validatedData.phoneNumber || "",
          description: validatedData.description,
          openingHour: validatedData.openingHour,
          establishedYear: validatedData.establishedYear,
          website: validatedData?.website,

          city: validatedData.city,
          country: validatedData.country,
        },
      });
      return { clinic };
    });

    revalidatePath(path || "/");

    return serverActionCreatedResponse(result);
  } catch (error: any) {
    console.error("❌ updateUserAndPatientAction error:", error);
    return serverActionErrorResponse(
      error || "Failed to update or create patient"
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
