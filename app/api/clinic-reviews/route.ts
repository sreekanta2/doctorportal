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

    // Clean AND
    where.AND = where.AND.filter((cond: any) => Object.keys(cond).length > 0);
    if (!where.AND.length) delete where.AND;

    // Order by
    let orderBy: any;
    switch (sortBy) {
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

    const [reviews, totalCount] = await Promise.all([
      prisma.clinicReview.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              createdAt: true,
            },
          },
          clinic: {
            select: {
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
          },
        },
      }),
      prisma.doctorReview.count({ where }),
    ]);
    if (!reviews || reviews.length === 0) {
      return errorResponse("No clinics found");
    }

    return successPaginationResponse(reviews, {
      limit: limitNum,
      total: totalCount,
      page: pageNum,
    });
  } catch (error) {
    console.error("Error fetching clinics:", error);
    return errorResponse(error);
  }
}
