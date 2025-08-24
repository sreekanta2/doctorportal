import { AppError } from "@/lib/actions/actions-error-response";
import { errorResponse } from "@/lib/api/api-response";
import prisma from "@/lib/db";

import { NextRequest, NextResponse } from "next/server";

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { doctorId: string } }
// ) {
//   const body = await req.json();

//   try {
//     // Validate incoming data (only require ID, other fields optional)
//     const validatedData = updateDoctorSchema.parse(body.data);

//     // Check if doctor exists
//     const existingDoctor = await prisma.doctor.findUnique({
//       where: { id: validatedData.id },
//     });

//     if (!existingDoctor) {
//       throw new AppError("Doctor not found", 404);
//     }

//     // Update doctor record
//     const updatedDoctor = await prisma.doctor.update({
//       where: { id: validatedData.id },
//       data: {
//         name: validatedData.firstName,
//         lastName: validatedData.lastName,
//         email: validatedData.email,
//         image: validatedData.image?.trim() || null,
//         department: validatedData.department,
//         bio: validatedData.bio?.trim() || null,
//         experience: validatedData.experience,
//         specialization: validatedData.specialization,
//         gender: validatedData.gender,
//         languages: validatedData.languages,
//         education: validatedData.education,
//         phoneNumber: validatedData.phoneNumber,
//         offlineFee: validatedData.offlineFee,
//         street: validatedData.street,
//         city: validatedData.city,
//         country: validatedData.country,
//         zipCode: validatedData.zipCode,
//       },
//     });

//     return createSuccessResponse(updatedDoctor);
//   } catch (error) {
//     return errorResponse(error);
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { doctorId: string } }
// ) {
//   const { doctorId } = params;

//   try {
//     if (!doctorId) {
//       throw new AppError("Doctor id is required");
//     }
//     const existingDoctor = await prisma.doctor.findUnique({
//       where: {
//         id: doctorId,
//       },
//     });

//     if (!existingDoctor) {
//       throw new AppError("Doctor not exit !");
//     }
//     const deletedDoctor = await prisma.doctor.delete({
//       where: {
//         id: existingDoctor?.id,
//       },
//     });
//     revalidatePath("/admin/doctors");
//     revalidatePath("/admin/dashboard");
//     revalidatePath("/doctors");
//     return successResponse(deletedDoctor);
//   } catch (error) {
//     return errorResponse(error);
//   }
// }

// Define interface for URL parameters

export async function GET(
  request: NextRequest,
  { params }: { params: { doctorId: string } }
) {
  const { doctorId } = params;
  const searchParams = request.nextUrl.searchParams;

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  if (!doctorId) {
    throw new AppError("Doctor ID is required");
  }

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        memberships: {
          include: {
            clinic: true,
            schedules: true,
          },
        },
      },
    });

    if (!doctor) {
      throw new AppError("Doctor not found");
    }

    // Fetch paginated reviews separately
    const reviews = await prisma.doctorReview.findMany({
      where: { doctorId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        patient: {
          select: {
            id: true,
            age: true,
            gender: true,
            phoneNumber: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    const totalReviews = await prisma.doctorReview.count({
      where: { doctorId },
    });

    return NextResponse.json(
      {
        doctor,
        reviews: {
          data: reviews,
          page,
          limit,
          totalItems: totalReviews,
          totalPages: Math.ceil(totalReviews / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
