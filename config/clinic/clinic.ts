import { AppError } from "@/lib/actions/actions-error-response";
import { SearchParams } from "@/types/common";

export async function getClinicProfileById(id: string) {
  if (!id) {
    throw new AppError("Unauthorized user!");
  }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/clinics/${id}`,
      {
        method: "GET",
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
export const getAllClinics = async (filterOptions?: SearchParams) => {
  try {
    const query = new URLSearchParams({
      sortOrder: filterOptions?.sortOrder || "desc",

      search: filterOptions?.search || "",

      page:
        filterOptions?.page !== undefined ? String(filterOptions.page) : "0",
      city: filterOptions?.city || "",
      limit:
        filterOptions?.limit !== undefined ? String(filterOptions.limit) : "0",
    });
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/clinics?${query.toString()}`,

      {
        method: "GET",
      }
    );
    return await res.json();
  } catch (error) {
    return error;
  }
};
