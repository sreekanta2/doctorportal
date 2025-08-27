import { SearchParams } from "@/types/common";

export const getAllDoctors = async (filterOptions?: SearchParams) => {
  try {
    const query = new URLSearchParams({
      sortBy: filterOptions?.sortBy || "rating",
      sortOrder: filterOptions?.sortOrder || "desc",
      minRating: filterOptions?.minRating || "",
      maxRating: filterOptions?.maxRating || "",
      search: filterOptions?.search || "",
      specialization: filterOptions?.specialization || "",
      page:
        filterOptions?.page !== undefined ? String(filterOptions.page) : "0",
      city: filterOptions?.city || "",
      limit:
        filterOptions?.limit !== undefined ? String(filterOptions.limit) : "0",
      gender: filterOptions?.gender || "",
    });
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/doctors?${query.toString()}`,

      {
        method: "GET",
      }
    );
    return await res.json();
  } catch (error) {
    return error;
  }
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
