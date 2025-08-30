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

    const where: any = {};

    // 🔍 Search by email or name
    if (search) {
      where.transactionId = {
        contains: search,
        mode: "insensitive",
      };
    }

    // 📝 Sorting
    let orderBy: any;
    switch (sortBy) {
      case "createdAt":
        orderBy = { createdAt: sortOrder };
        break;
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // 📄 Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // 📊 Query subscriptions + count
    const [subscriptions, totalCount] = await Promise.all([
      prisma.subscription.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          clinic: {
            select: {
              id: true,
              user: { select: { id: true, email: true, name: true } },
            },
          },
          pricePlan: true,
        },
      }),
      prisma.subscription.count({ where }),
    ]);

    return successPaginationResponse(subscriptions, {
      limit: limitNum,
      total: totalCount,
      page: pageNum,
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return errorResponse(error);
  }
}
