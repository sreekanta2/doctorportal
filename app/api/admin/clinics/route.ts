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

    const where: any = { AND: [] };

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

    // Order by
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
            select: {
              schedules: true,
            },
          },
        },
      }),
      prisma.clinic.count({ where }),
    ]);
    if (!clinics || clinics.length === 0) {
      return errorResponse("No clinics found");
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
