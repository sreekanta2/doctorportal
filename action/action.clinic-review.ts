"use server";
import prisma from "@/lib/db";

import { AppError } from "@/lib/actions/actions-error-response";
import {
  serverActionCreatedResponse,
  serverActionErrorResponse,
  serverActionSuccessResponse,
} from "@/lib/actions/server-actions-response";
import {
  ClinicReviewCreateInput,
  ClinicReviewUpdateInput,
  CreateClinicReviewSchema,
} from "@/zod-validation/clinicReviewSchema";
import { revalidatePath } from "next/cache";

export async function createClinicReviewAction(data: ClinicReviewCreateInput) {
  try {
    const validatedData = CreateClinicReviewSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { id: validatedData.reviewerId },
      include: { clinic: true },
    });

    if (!existingUser) {
      throw new AppError("Reviewer not found", 404);
    }

    if (existingUser?.clinic?.id === validatedData.clinicId) {
      throw new AppError("You cannot review your own clinic", 403);
    }

    // Create the review
    const review = await prisma.clinicReview.create({
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

    revalidatePath(`/clinics/${validatedData.clinicId}`);

    return serverActionCreatedResponse(review);
  } catch (error: any) {
    console.error("❌ createClinicReviewAction error:", error);
    return serverActionErrorResponse(error || "Failed to create clinic review");
  }
}

export async function updateClinicReviewAction(
  reviewId: string,
  data: ClinicReviewUpdateInput
) {
  try {
    const validatedData = CreateClinicReviewSchema.parse(data);

    // Find the review
    const existingReview = await prisma.clinicReview.findUnique({
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
      include: { clinic: true },
    });

    if (!existingUser) {
      return serverActionErrorResponse("Reviewer not found");
    }

    if (existingUser?.clinic?.id === validatedData.clinicId) {
      return serverActionErrorResponse("You cannot review your own clinic");
    }

    // Update review
    const updatedReview = await prisma.clinicReview.update({
      where: { id: reviewId },
      data: {
        comment: validatedData.comment,
        rating: validatedData.rating,
      },
    });

    // Recalculate the clinic's average rating & review count based only on approved reviews
    const aggregation = await prisma.clinicReview.aggregate({
      where: { clinicId: validatedData.clinicId },
      _avg: { rating: true },
      _count: { id: true },
    });

    const newAverageRating = aggregation._avg.rating
      ? parseFloat(aggregation._avg.rating.toFixed(1))
      : 0;

    const newReviewCount = aggregation._count.id;

    await prisma.clinic.update({
      where: { id: validatedData.clinicId },
      data: {
        averageRating: newAverageRating,
        reviewsCount: newReviewCount,
      },
    });

    // Revalidate clinic page
    revalidatePath(`/clinics/${validatedData.clinicId}`);

    return serverActionSuccessResponse(updatedReview);
  } catch (error: any) {
    console.error("❌ updateClinicReviewAction error:", error);
    return serverActionErrorResponse(error || "Failed to update clinic review");
  }
}

export async function deleteClinicReview(id: string) {
  try {
    if (!id) return serverActionErrorResponse("ID is required");

    const review = await prisma.clinicReview.findUnique({
      where: { id },
    });
    if (!review) return serverActionErrorResponse("Review not found");

    await prisma.clinicReview.delete({
      where: { id },
    });

    // Recalculate clinic rating & review count after deletion
    const aggregation = await prisma.clinicReview.aggregate({
      where: { clinicId: review.clinicId },
      _avg: { rating: true },
      _count: { id: true },
    });

    const newAverageRating = aggregation._avg.rating || 0;
    const newReviewCount = aggregation._count.id;

    await prisma.clinic.update({
      where: { id: review.clinicId },
      data: {
        averageRating: newAverageRating,
        reviewsCount: newReviewCount,
      },
    });

    revalidatePath(`/clinics/${review.clinicId}`);

    return serverActionSuccessResponse(null);
  } catch (error: any) {
    console.error("❌ deleteClinicReview error:", error);
    return serverActionErrorResponse(error || "Failed to delete clinic review");
  }
}
