import { AppError } from "@/lib/actions/actions-error-response";
import { serverActionErrorResponse } from "@/lib/actions/server-actions-response";
import { SearchParams } from "@/types/common";
export async function getPatientProfileById(id: string) {
  if (!id) {
    throw new AppError("Unauthorized user!");
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/patients/${id}`,
      {
        method: "GET",
      }
    );
    if (!res.ok) {
      throw new AppError("Failed to fetch patient profile", res.status);
    }
    return await res.json();
  } catch (error) {
    return error;
  }
}

export const getAllPatients = async (filterOptions?: SearchParams) => {
  try {
    const query = new URLSearchParams({
      sortOrder: filterOptions?.sortOrder || "desc",

      search: filterOptions?.search || "",
      page:
        filterOptions?.page !== undefined ? String(filterOptions.page) : "0",
      city: filterOptions?.city || "",
      limit:
        filterOptions?.limit !== undefined ? String(filterOptions.limit) : "0",
      gender: filterOptions?.gender || "",
    });
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/patients?${query.toString()}`,

      {
        method: "GET",
      }
    );
    return await res.json();
  } catch (error) {
    return serverActionErrorResponse(error);
  }
};
