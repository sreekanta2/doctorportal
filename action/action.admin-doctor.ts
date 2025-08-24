"use server";

import { AppError } from "@/lib/actions/actions-error-response";
import {
  serverActionCreatedResponse,
  serverActionErrorResponse,
  serverActionSuccessResponse,
} from "@/lib/actions/server-actions-response";
import prisma from "@/lib/db";
import {
  CreateDoctorInput,
  createDoctorSchema,
  UpdateDoctorInput,
  updateDoctorSchema,
} from "@/zod-validation/doctor";
import bcrypt, { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function adminDoctorCreate(data: CreateDoctorInput) {
  try {
    // ✅ Validate input
    const validatedData = createDoctorSchema.parse(data);

    // ✅ Hash password (use a default if not provided)
    const hashedPassword = await bcrypt.hash(
      validatedData.password || "Default@123",
      10
    );

    // ✅ Check if user exists
    let existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    if (existingUser) {
      throw new AppError("Email is already registered.");
    }
    const newUser = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        role: "doctor",
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });

    // ✅ Create doctor profile
    const doctor = await prisma.doctor.create({
      data: {
        userId: newUser.id,
        degree: validatedData.degree,
        gender: validatedData.gender,
        hospital: validatedData.hospital,
        street: validatedData.street,
        state: validatedData.state,
        city: validatedData.city,
        country: validatedData.country,
        zipCode: validatedData.zipCode,
        specialization: validatedData.specialization,
      },
    });

    // ✅ Revalidate doctors page
    revalidatePath("/admin/doctors");

    return serverActionCreatedResponse(doctor);
  } catch (error: any) {
    console.error("❌ adminDoctorCreate error:", error);
    return serverActionErrorResponse(error);
  }
}

export async function adminDoctorUpdate(data: UpdateDoctorInput) {
  try {
    // Validate incoming data
    const validatedData = updateDoctorSchema.parse(data);

    // Fetch existing doctor
    const doctor = await prisma.doctor.findUnique({
      where: { id: validatedData.id },
      include: { user: true },
    });

    if (!doctor) throw new Error("Doctor not found");

    // Update related User
    const userUpdates: any = {
      name: validatedData.name,
      email: validatedData.email,
      image: validatedData.image,
      emailVerified: new Date(),
    };

    if (validatedData.password && validatedData.password.trim() !== "") {
      userUpdates.password = await hash(validatedData.password, 10);
    }

    await prisma.user.update({
      where: { id: doctor.userId },
      data: userUpdates,
    });

    // Update Doctor profile
    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctor.id },
      data: {
        degree: validatedData.degree,
        gender: validatedData.gender,
        hospital: validatedData.hospital,
        street: validatedData.street,
        state: validatedData.state,
        city: validatedData.city,
        country: validatedData.country,
        zipCode: validatedData.zipCode,
        specialization: validatedData.specialization,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        },
      },
    });

    // Revalidate doctors list page
    revalidatePath("/admin/doctors");

    return serverActionSuccessResponse(updatedDoctor);
  } catch (error) {
    return serverActionErrorResponse(error);
  }
}

export async function adminDoctorDelete(email: string) {
  try {
    // Validate incoming data
    const validatedEmail = z.string().email().parse(email);

    // Fetch existing doctor
    const doctor = await prisma.user.findUnique({
      where: { email: validatedEmail },
      include: { doctor: true },
    });

    if (!doctor) throw new Error("Doctor not found");

    // Delete doctor profile
    await prisma.user.delete({
      where: { email: validatedEmail },
    });

    // Revalidate doctors list page
    revalidatePath("/admin/doctors");

    return serverActionSuccessResponse({
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    return serverActionErrorResponse(error);
  }
}
