"use server";

import { AppError } from "@/lib/actions/actions-error-response";
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
  updateClinicSchema,
} from "@/zod-validation/clinic";
import {
  CreateDoctorInput,
  createDoctorSchema,
  UpdateDoctorInput,
  updateDoctorSchema,
} from "@/zod-validation/doctor";
import {
  DoctorReviewUpdateInput,
  UpdateDoctorReviewSchema,
} from "@/zod-validation/doctor-review-scema";
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
        image: validatedData.image || "",
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
        city: validatedData.city,
        country: validatedData.country,
        specialization: validatedData.specialization,
        website: validatedData?.website,
      },
    });
    const name =
      validatedData.specialization.charAt(0).toUpperCase() +
      validatedData.specialization.slice(1).toLowerCase();
    await prisma.specialization.update({
      where: { name: name },
      data: { totalDoctors: { increment: 1 } },
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
        city: validatedData.city,
        country: validatedData.country,
        specialization: validatedData.specialization,
        website: validatedData?.website,
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
export async function updateAdminDoctorReviewAction(
  data: DoctorReviewUpdateInput
) {
  try {
    const validatedData = UpdateDoctorReviewSchema.parse(data);

    const existingReview = await prisma.doctorReview.findUnique({
      where: { id: validatedData.id },
    });

    if (!existingReview) {
      throw new AppError("Review not found", 404);
    }

    // Update review
    const updatedReview = await prisma.doctorReview.update({
      where: { id: validatedData.id },
      data: {
        comment: validatedData.comment,
        rating: validatedData.rating,
        status: validatedData.status,
      },
    });

    // Recalculate the doctor's average rating & review count
    const aggregation = await prisma.doctorReview.aggregate({
      where: { doctorId: validatedData.doctorId },
      _avg: { rating: true },
      _count: { id: true },
    });

    const newAverageRating = aggregation._avg.rating || 0;
    const newReviewCount = aggregation._count.id;

    await prisma.doctor.update({
      where: { id: validatedData.doctorId },
      data: {
        averageRating: newAverageRating,
        reviewsCount: newReviewCount,
      },
    });

    revalidatePath(`/admin/dashboard`);
    return serverActionSuccessResponse(updatedReview);
  } catch (error: any) {
    console.error("❌ updateDoctorReviewAction error:", error);
    return serverActionErrorResponse(error || "Failed to update doctor review");
  }
}
// clinics
export async function createAdminUserAndClinicAction(data: CreateClinicInput) {
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
          city: validatedData.city,
          country: validatedData.country,
          userId: user.id,
          website: validatedData?.website,
        },
      });

      return { user, clinic };
    });

    revalidatePath("/admin/clinics");
    return serverActionSuccessResponse(result);
  } catch (error: any) {
    console.error("❌ createUserAndClinicAction error:", error);
    return serverActionErrorResponse(
      error || "Failed to create user and clinic"
    );
  }
}
export async function updateAdminUserAndClinicAction(data: UpdateClinicInput) {
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

          city: validatedData.city,
          country: validatedData.country,
          website: validatedData?.website,
        },
      });
      return { clinic };
    });

    revalidatePath("/admin/clinics");

    return serverActionCreatedResponse(result);
  } catch (error: any) {
    console.error("❌ updateUserAndPatientAction error:", error);
    return serverActionErrorResponse(
      error || "Failed to update or create patient"
    );
  }
}
export async function deleteAdminClinic(email: string) {
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

//
export async function deleteAdminPatient(email: string) {
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
