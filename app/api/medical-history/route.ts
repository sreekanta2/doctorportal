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
      sortBy = "createdAt",
      sortOrder = "desc",
      page = "1",
      limit = "10",
      id,
      doctorId,
    } = params;

    // Require id
    if (!id) {
      return errorResponse("id is required");
    }
    const patient = await prisma.patient.findUnique({
      where: { userId: id },
      include: { user: true },
    });

    if (!patient) {
      return errorResponse("Patient not found");
    }
    const where: any = { AND: [{ patientId: patient?.id }] };

    // Optionally filter by doctorId
    if (doctorId) {
      where.AND.push({ doctorId });
    }

    // Order by

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [medicalRecords, totalCount] = await Promise.all([
      prisma.pastAppointment.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          doctor: {
            include: {
              user: true,
            },
          },
          medicalHistory: true,
        },
      }),
      prisma.medicalHistory.count({ where }),
    ]);

    if (!medicalRecords || medicalRecords.length === 0) {
      return errorResponse("No medicalRecords found");
    }

    return successPaginationResponse(medicalRecords, {
      limit: limitNum,
      total: totalCount,
      page: pageNum,
    });
  } catch (error) {
    console.error("Error fetching medicalRecords:", error);
    return errorResponse(error);
  }
}
