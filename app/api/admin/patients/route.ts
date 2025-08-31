import {
  errorResponse,
  successPaginationResponse,
} from "@/lib/api/api-response";
import prisma from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Extract query params
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as
      | "asc"
      | "desc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.user = {
        name: {
          contains: search,
          mode: "insensitive",
        },
      };
    }

    // Fetch patients & total count in parallel
    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        skip,
        take: limit,
        where,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              image: true,
            },
          },
        },
      }),
      prisma.patient.count({ where }),
    ]);

    return successPaginationResponse(patients, {
      limit,
      total,
      page,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return errorResponse(error);
  }
}
