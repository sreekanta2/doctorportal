import { AppError } from "@/lib/actions/actions-error-response";
import { errorResponse } from "@/lib/api/api-response";
import prisma from "@/lib/db";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { doctorId: string } }
) {
  const { doctorId } = params;
  const searchParams = request.nextUrl.searchParams;

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  if (!doctorId) {
    throw new AppError("Doctor ID is required");
  }

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        memberships: {
          select: {
            id: true,
            fee: true,
            maxAppointments: true,
            discount: true,
            clinic: {
              select: {
                id: true,
                street: true,
                city: true,
                country: true,
                phoneNumber: true,
                openingHour: true,
                averageRating: true,
                reviewsCount: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
            schedules: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!doctor) {
      throw new AppError("Doctor not found");
    }

    // Fetch paginated reviews separately
    const reviews = await prisma.doctorReview.findMany({
      where: { doctorId, status: "approved" },
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    const totalReviews = await prisma.doctorReview.count({
      where: { doctorId, status: "approved" },
    });

    return NextResponse.json(
      {
        doctor,

        reviews: {
          reviews,
          pagination: {
            page,
            limit,
            total: totalReviews,
            totalPages: Math.ceil(totalReviews / limit),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
