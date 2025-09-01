import prisma from "@/lib/db";
import { SearchParams } from "@/types/common";
export const getAllDoctors = async (filterOptions?: SearchParams) => {
  const query = new URLSearchParams({
    sortBy: filterOptions?.sortBy || "rating",
    sortOrder: filterOptions?.sortOrder || "desc",
    search: filterOptions?.search || "",
    specialization: filterOptions?.specialization || "",
    page: filterOptions?.page !== undefined ? String(filterOptions.page) : "0",
    city: filterOptions?.city || "",
    limit:
      filterOptions?.limit !== undefined ? String(filterOptions.limit) : "0",
    gender: filterOptions?.gender || "",
  });
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/doctors?${query.toString()}`
  );

  setTimeout(async () => {}, 300);
  return await res.json();
};
export const getSingleDoctor = async (
  id: string,
  page?: number,
  limit?: number
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/doctors/${id}?page=${page}&limit=${limit}`,

      {
        method: "GET",
      }
    );

    return await res.json();
  } catch (error) {
    return error;
  }
};
// config/doctor/doctors.ts
export async function getDoctorSEO(doctorId: string) {
  return prisma.doctor.findUnique({
    where: { id: doctorId },
    select: {
      id: true,
      specialization: true,
      hospital: true,
      city: true,
      country: true,
      averageRating: true,
      reviewsCount: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
}
