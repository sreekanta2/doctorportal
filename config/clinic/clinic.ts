import { AppError } from "@/lib/actions/actions-error-response";
import {
  serverActionErrorResponse,
  serverActionSuccessResponse,
} from "@/lib/actions/server-actions-response";
import prisma from "@/lib/db";
import { SearchParams } from "@/types/common";

export async function getClinicProfileById(
  id: string,
  page?: number,
  limit?: number
) {
  if (!id) {
    throw new AppError("Unauthorized user!");
  }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/clinics/${id}?page=${page}&limit=${limit}`,
      {
        method: "GET",
        cache: "no-store", // optional, prevents caching
      }
    );

    if (!res.ok) {
      throw new AppError("Failed to fetch clinic profile", res.status);
    }

    return await res.json();
  } catch (error) {
    return error;
  }
}

export const getAllClinics = async (
  path: string,
  filterOptions?: SearchParams
) => {
  try {
    const query = new URLSearchParams({
      sortOrder: filterOptions?.sortOrder || "desc",

      search: filterOptions?.search || "",

      page:
        filterOptions?.page !== undefined ? String(filterOptions.page) : "1",
      city: filterOptions?.city || "",
      limit:
        filterOptions?.limit !== undefined ? String(filterOptions.limit) : "10",
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/${path}?${query.toString()}`,

      {
        method: "GET",
      }
    );
    return await res.json();
  } catch (error) {
    return error;
  }
};
export async function getClinicProfileByEmail(email: string) {
  if (!email) {
    throw new AppError("Unauthorized user!");
  }
  try {
    const userWithClinic = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        password: true,
        emailVerified: true,
        clinic: {
          select: {
            id: true,
            phoneNumber: true,
            description: true,
            city: true,
            website: true,
            country: true,
            openingHour: true,
            establishedYear: true,
            averageRating: true,
            reviewsCount: true,
          },
        },
      },
    });
    if (!userWithClinic) {
      throw new Error("User not found");
    }
    return serverActionSuccessResponse(userWithClinic);
  } catch (error) {
    return serverActionErrorResponse(error);
  }
}
