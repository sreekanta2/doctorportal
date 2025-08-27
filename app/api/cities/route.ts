import {
  errorResponse,
  successPaginationResponse,
  successResponse,
} from "@/lib/api/api-response";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    // Pagination mode
    if (page && limit) {
      const pageNumber = Math.max(parseInt(page, 10), 1);
      const pageSize = Math.max(parseInt(limit, 10), 1);

      const [data, total] = await Promise.all([
        prisma.city.findMany({
          skip: (pageNumber - 1) * pageSize,
          take: pageSize,
          orderBy: { name: "asc" }, // consistent ordering
        }),
        prisma.city.count(),
      ]);

      return successPaginationResponse(data, {
        page: pageNumber,
        limit: pageSize,
        total,
      });
    }

    // No pagination mode
    const data = await prisma.city.findMany({
      orderBy: { name: "asc" },
    });

    return successResponse({ data });
  } catch (error) {
    return errorResponse(error);
  }
}
