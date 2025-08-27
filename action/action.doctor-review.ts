"use server";
import prisma from "@/lib/db";
import { DoctorReviewUpdateInput } from "./../zod-validation/doctor-review-scema";

import {
  serverActionCreatedResponse,
  serverActionErrorResponse,
  serverActionSuccessResponse,
} from "@/lib/actions/server-actions-response";
import {
  CreateDoctorReviewSchema,
  DoctorReviewCreateInput,
} from "@/zod-validation/doctor-review-scema";
import { revalidatePath } from "next/cache";

export async function createDoctorReviewAction(data: DoctorReviewCreateInput) {
  try {
    const validatedData = CreateDoctorReviewSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { id: validatedData.reviewerId },
      include: { doctor: true },
    });

    if (!existingUser) {
      return serverActionErrorResponse("Reviewer not found");
    }

    if (existingUser?.doctor?.id === validatedData.doctorId) {
      return serverActionErrorResponse("You cannot review your own profile");
    }

    // Create the review
    const review = await prisma.doctorReview.create({
      data: { ...validatedData, reviewerId: validatedData.reviewerId },
    });

    // // Calculate the new average rating & count
    // const aggregation = await prisma.doctorReview.aggregate({
    //   where: { doctorId: validatedData.doctorId },
    //   _avg: { rating: true },
    //   _count: { id: true },
    // });

    // const newAverageRating = aggregation._avg.rating || 0;
    // const newReviewCount = aggregation._count.id;

    // // Update the doctor's average rating & review count
    // await prisma.doctor.update({
    //   where: { id: validatedData.doctorId },
    //   data: {
    //     averageRating: newAverageRating,
    //     reviewsCount: newReviewCount,
    //   },
    // });

    revalidatePath(`/doctors/${validatedData.doctorId}`);

    return serverActionCreatedResponse(review);
  } catch (error: any) {
    console.error("❌ createDoctorReviewAction error:", error);
    return serverActionErrorResponse(error || "Failed to create doctor review");
  }
}

export async function updateDoctorReviewAction(
  reviewId: string,
  data: DoctorReviewUpdateInput
) {
  try {
    const validatedData = CreateDoctorReviewSchema.parse(data);

    // Find the review
    const existingReview = await prisma.doctorReview.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return serverActionErrorResponse("Review not found");
    }

    // Ensure users can only update their own review
    if (existingReview.reviewerId !== validatedData.reviewerId) {
      return serverActionErrorResponse("You cannot edit someone else's review");
    }

    // Prevent self-review
    const existingUser = await prisma.user.findUnique({
      where: { id: validatedData.reviewerId },
      include: { doctor: true },
    });

    if (!existingUser) {
      return serverActionErrorResponse("Reviewer not found");
    }

    if (existingUser?.doctor?.id === validatedData.doctorId) {
      return serverActionErrorResponse("You cannot review your own profile");
    }

    // Update review
    const updatedReview = await prisma.doctorReview.update({
      where: { id: reviewId },
      data: {
        comment: validatedData.comment,
        rating: validatedData.rating,
      },
    });

    // Recalculate the doctor's average rating & review count based only on approved reviews
    const aggregation = await prisma.doctorReview.aggregate({
      where: { doctorId: validatedData.doctorId, status: "approved" },
      _avg: { rating: true },
      _count: { id: true },
    });

    const newAverageRating = aggregation._avg.rating
      ? parseFloat(aggregation._avg.rating.toFixed(1))
      : 0;

    const newReviewCount = aggregation._count.id;

    await prisma.doctor.update({
      where: { id: validatedData.doctorId },
      data: {
        averageRating: newAverageRating,
        reviewsCount: newReviewCount,
      },
    });

    // Revalidate doctor page
    revalidatePath(`/doctors/${validatedData.doctorId}`);

    return serverActionSuccessResponse(updatedReview);
  } catch (error: any) {
    console.error("❌ updateDoctorReviewAction error:", error);
    return serverActionErrorResponse(error || "Failed to update doctor review");
  }
}

export async function deleteDoctorReview(id: string) {
  try {
    if (!id) return serverActionErrorResponse("ID is required");

    const review = await prisma.doctorReview.findUnique({
      where: { id },
    });
    if (!review) return serverActionErrorResponse("Review not found");

    await prisma.doctorReview.delete({
      where: { id },
    });

    // Recalculate doctor rating & review count after deletion
    const aggregation = await prisma.doctorReview.aggregate({
      where: { doctorId: review.doctorId },
      _avg: { rating: true },
      _count: { id: true },
    });

    const newAverageRating = aggregation._avg.rating || 0;
    const newReviewCount = aggregation._count.id;

    await prisma.doctor.update({
      where: { id: review.doctorId },
      data: {
        averageRating: newAverageRating,
        reviewsCount: newReviewCount,
      },
    });

    revalidatePath(`/doctors/${review.doctorId}`);

    return serverActionSuccessResponse(null);
  } catch (error: any) {
    console.error("❌ deleteDoctorReview error:", error);
    return serverActionErrorResponse(error || "Failed to delete doctor review");
  }
}
