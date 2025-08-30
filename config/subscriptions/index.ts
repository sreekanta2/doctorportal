import { serverActionErrorResponse } from "@/lib/actions/server-actions-response";
import { SearchParams } from "@/types/common";

export const getAllSubscriptions = async (filterOptions?: SearchParams) => {
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
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/subscriptions?${query.toString()}`,

      {
        method: "GET",
      }
    );
    return await res.json();
  } catch (error) {
    return serverActionErrorResponse(error);
  }
};
