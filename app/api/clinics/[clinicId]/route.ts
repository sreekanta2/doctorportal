import { AppError } from "@/lib/actions/actions-error-response";
import { errorResponse } from "@/lib/api/api-response";
import prisma from "@/lib/db";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { clinicId: string } }
) {
  const { clinicId } = params;
  const searchParams = request.nextUrl.searchParams;

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  if (!clinicId) {
    throw new AppError("Clinic ID is required");
  }

  try {
    const clinic = await prisma.clinic.findUnique({
      where: {
        id: clinicId,
        subscription: {
          endDate: { gte: new Date() },
          status: "ACTIVE",
        },
      },
      include: {
        memberships: {
          include: {
            doctor: {
              include: {
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

    if (!clinic) {
      throw new AppError("Clinic not found or subscription expired");
    }

    // Fetch paginated reviews separately (only for valid clinic)
    const reviews = await prisma.clinicReview.findMany({
      where: { clinicId, status: "approved" },
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

    const totalReviews = await prisma.clinicReview.count({
      where: { clinicId, status: "approved" },
    });

    return NextResponse.json(
      {
        clinic,
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
