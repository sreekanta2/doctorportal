"use server";
import { AppError } from "@/lib/actions/actions-error-response";
import {
  serverActionCreatedResponse,
  serverActionErrorResponse,
  ServerActionResponse,
  serverActionSuccessResponse,
} from "@/lib/actions/server-actions-response";
import prisma from "@/lib/db";
import { createClinicMembershipSchema } from "@/zod-validation/membership";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createClinicMembershipAction = async (
  data: z.infer<typeof createClinicMembershipSchema>
): Promise<ServerActionResponse<any>> => {
  try {
    const validatedData = createClinicMembershipSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { id: validatedData.clinicId },
      include: { clinic: true },
    });

    if (!existingUser?.clinic?.id) {
      throw new AppError("Complete profile  first");
    }
    const exitingMemberShip = await prisma.clinicMembership.findFirst({
      where: {
        doctorId: validatedData?.doctorId,
        clinicId: existingUser?.clinic?.id,
      },
    });

    if (exitingMemberShip) {
      throw new AppError("This doctor already added your clinic");
    }
    const newMembership = await prisma.clinicMembership.create({
      data: { ...validatedData, clinicId: existingUser.clinic.id },
    });
    revalidatePath("/clinic/doctors");
    return serverActionCreatedResponse(newMembership, {
      message: "Successfully create membership ",
    });
  } catch (error) {
    return serverActionErrorResponse(error);
  }
};

// /**
//  * Get all doctors with memberships associated with a clinic admin's clinic.
//  * @param adminId - The Clerk user ID of the clinic administrator.
//  * @param options - Pagination and sorting options.
//  * @returns ApiResponse containing a list of memberships and pagination metadata.
//  */
// export const getAllMembershipDoctorWithClinicAdminId = async (
//   adminId: string,
//   options: {
//     page?: number;
//     limit?: number;
//     sortBy?: "firstName" | "lastName" | "createdAt";
//     sortOrder?: "asc" | "desc";
//   } = {}
// ): Promise<ApiResponse<any[]>> => {
//   // Adjust `any[]` to your actual Membership type with relations
//   try {
//     // 1. Set default values for pagination and sorting.
//     const page = options.page || 1;
//     const limit = options.limit || 10;
//     const sortBy = options.sortBy || "createdAt";
//     const sortOrder = options.sortOrder || "desc";

//     // 2. Input validation for pagination parameters.
//     if (page < 1) {
//       return createErrorResponse("Invalid page number", {
//         code: "INVALID_INPUT",
//         defaultMessage: "Page number must be at least 1.",
//       });
//     }
//     if (limit < 1 || limit > 100) {
//       return createErrorResponse("Invalid page size", {
//         code: "INVALID_INPUT",
//         defaultMessage: "Page size must be between 1 and 100.",
//       });
//     }

//     // 3. Find the admin user and their associated clinic.
//     const existingUser = await prisma.user.findUnique({
//       where: { id: adminId },
//       include: { clinics: true },
//     });

//     // 4. Handle cases where admin or clinic is not found.
//     if (!existingUser?.clinics?.id) {
//       return createErrorResponse("Clinic not found for admin", {
//         code: "CLINIC_NOT_FOUND",
//         defaultMessage: "No clinic found associated with this administrator.",
//       });
//     }

//     // 5. Prepare pagination values.
//     const skip = (page - 1) * limit;
//     const clinicId = existingUser.clinics.id;

//     // 6. Get total count for pagination metadata.
//     const totalCount = await prisma.clinicMembership.count({
//       where: { clinicId },
//     });

//     // 7. Fetch paginated and sorted results.
//     const memberships = await prisma.clinicMembership.findMany({
//       where: { clinicId },
//       include: {
//         doctor: true, // Include doctor details
//         schedules: true, // Include schedules if needed
//       },
//       skip,
//       take: limit,
//       orderBy: {
//         // Correctly order by doctor's fields
//         doctor: {
//           [sortBy]: sortOrder,
//         },
//       },
//     });

//     // 8. Return paginated success response.
//     return createPaginatedResponse(
//       memberships,
//       {
//         total: totalCount,
//         page,
//         limit: limit,
//       },
//       {
//         message: "Clinic memberships fetched successfully.",
//       }
//     );
//   } catch (error) {
//     // 9. Centralized error handling.
//     return createErrorResponse(error, {
//       defaultMessage: "Failed to fetch clinic memberships.",
//       code: "MEMBERSHIP_FETCH_FAILED", // Specific code for this operation
//     });
//   }
// };

/**
 * Delete a clinic membership by its ID.
 * @param id - The ID of the clinic membership to delete.
 * @returns ApiResponse indicating success or failure.
 */
export const deleteMembership = async (
  id: string
): Promise<ServerActionResponse<any>> => {
  try {
    // 1. Check if the membership exists.
    const existingMembership = await prisma.clinicMembership.findUnique({
      where: { id },
    });

    // 2. Handle case where membership is not found.
    if (!existingMembership) {
      return serverActionErrorResponse("Membership not found");
    }

    // 3. Delete the membership.
    await prisma.clinicMembership.delete({
      where: { id },
    });
    revalidatePath("/clinic/doctors");
    // 4. Return success response. For deletes, data can often be `null` or a confirmation message.
    return serverActionSuccessResponse(null, {
      message: "Clinic membership deleted successfully.",
    });
  } catch (error) {
    // 5. Centralized error handling.
    return serverActionErrorResponse(error);
  }
};
