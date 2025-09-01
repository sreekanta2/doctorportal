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
      specialization,
      city,
      country,
      gender,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = "1",
      limit = "10",
    } = params;

    const where: any = {
      AND: [
        {
          memberships: {
            some: {
              clinic: {
                subscription: {
                  status: "ACTIVE",
                  endDate: { gte: new Date() },
                },
              },
            },
          },
        },
      ],
    };

    // 🔍 Search by doctor name
    if (search) {
      where.AND.push({
        OR: [{ user: { name: { contains: search, mode: "insensitive" } } }],
      });
    }

    // Filters
    if (specialization) where.AND.push({ specialization });
    if (city) where.AND.push({ city });
    if (country) where.AND.push({ country });
    if (gender) where.AND.push({ gender });

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

    const [doctors, totalCount] = await Promise.all([
      prisma.doctor.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
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
          memberships: {
            where: {
              clinic: {
                subscription: {
                  endDate: { gte: new Date() },
                  status: "ACTIVE",
                },
              },
            },
            select: {
              id: true,
              fee: true,
              maxAppointments: true,
              discount: true,
              clinic: {
                select: {
                  id: true,

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
        },
      }),
      prisma.doctor.count({ where }),
    ]);

    return successPaginationResponse(doctors, {
      limit: limitNum,
      total: totalCount,
      page: pageNum,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return errorResponse(error);
  }
}
