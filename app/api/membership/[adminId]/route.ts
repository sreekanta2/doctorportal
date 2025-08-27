import { AppError } from "@/lib/actions/actions-error-response";
import {
  errorResponse,
  successPaginationResponse,
  successResponse,
} from "@/lib/api/api-response";
import prisma from "@/lib/db";
import { SearchParams } from "@/types/common";

import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { adminId: string } }
) {
  const id = params.adminId;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const sortBy =
    (searchParams.get("sortBy") as SearchParams["sortBy"]) || "createdAt";
  const sortOrder = searchParams.get("sortOrder") as "asc" | "desc";
  try {
    if (!id) {
      throw new AppError("User Id is required!");
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: id },
      include: { clinic: true },
    });
    if (!existingUser?.clinic?.id) {
      throw new AppError("Complete profile  first");
    }

    const skip = (page - 1) * limit;
    const clinicId = existingUser.clinic.id;

    const totalCount = await prisma.clinicMembership.count({
      where: { clinicId },
    });

    const memberships = await prisma.clinicMembership.findMany({
      where: { clinicId },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        schedules: true,
      },
      skip,
      take: limit,
      orderBy: {
        doctor: {
          [sortBy]: sortOrder,
        },
      },
    });

    return successPaginationResponse(memberships, {
      total: totalCount,
      page,
      limit: limit,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { adminId: string } }
) {
  try {
    const membershipId = params.adminId;
    if (!membershipId) {
      throw new AppError("Unauthorized user");
    }

    const existingMembership = await prisma.clinicMembership.findUnique({
      where: { id: membershipId },
    });

    if (!existingMembership) {
      throw new AppError("Unauthorized user");
    }

    const result = await prisma.clinicMembership.delete({
      where: { id: membershipId },
    });

    return successResponse(result, {
      message: "Membership deleted successfully",
    });
  } catch (error) {
    return errorResponse(error);
  }
}
