import { AppError } from "@/lib/actions/actions-error-response";
import {
  errorResponse,
  successPaginationResponse,
} from "@/lib/api/api-response";
import prisma from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const {
      search,
      city,
      country,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = "1",
      limit = "10",
    } = params;

    const where: any = {
      AND: [
        {
          subscription: {
            status: "ACTIVE",
            endDate: { gte: new Date() }, // ✅ only valid subscriptions
          },
        },
      ],
    };

    // Text search
    if (search) {
      where.AND.push({
        OR: [{ user: { name: { contains: search, mode: "insensitive" } } }],
      });
    }

    // Exact match filters
    if (city) where.AND.push({ city });
    if (country) where.AND.push({ country });

    // Clean AND
    where.AND = where.AND.filter((cond: any) => Object.keys(cond).length > 0);
    if (!where.AND.length) delete where.AND;

    // Sorting
    let orderBy: any;
    switch (sortBy) {
      case "rating":
        orderBy = { averageRating: sortOrder };
        break;
      case "createdAt":
        orderBy = { createdAt: sortOrder };
        break;
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [clinics, totalCount] = await Promise.all([
      prisma.clinic.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        select: {
          id: true,
          averageRating: true,
          city: true,
          country: true,
          phoneNumber: true,
          openingHour: true,
          subscription: {
            select: {
              status: true,
              endDate: true,
              startDate: true,
              pricePlan: { select: { plan: true, price: true } },
            },
          },
          memberships: {
            select: {
              doctor: {
                select: {
                  user: {
                    select: {
                      name: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
              createdAt: true,
            },
          },
        },
      }),
      prisma.clinic.count({ where }),
    ]);

    if (!clinics || clinics.length === 0) {
      throw new AppError("No clinics with valid subscription found", 404);
    }

    return successPaginationResponse(clinics, {
      limit: limitNum,
      total: totalCount,
      page: pageNum,
    });
  } catch (error) {
    console.error("Error fetching clinics:", error);
    return errorResponse(error);
  }
}
