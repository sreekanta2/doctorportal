import { SearchParams } from "@/types/common";

export const getAllDoctorsReviews = async (filterOptions?: SearchParams) => {
  try {
    const query = new URLSearchParams({
      sortBy: filterOptions?.sortBy || "rating",
      sortOrder: filterOptions?.sortOrder || "desc",

      search: filterOptions?.search || "",

      page:
        filterOptions?.page !== undefined ? String(filterOptions.page) : "0",

      limit:
        filterOptions?.limit !== undefined ? String(filterOptions.limit) : "0",
    });
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/doctor-reviews?${query.toString()}`,

      {
        method: "GET",
      }
    );
    return await res.json();
  } catch (error) {
    return error;
  }
};
export const getSingleDoctorReview = async (
  id: string,
  page?: number,
  limit?: number
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/doctor-reviews/${id}/reviews`,

      {
        method: "GET",
      }
    );

    return await res.json();
  } catch (error) {
    return error;
  }
};
