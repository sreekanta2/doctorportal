import { SearchParams } from "@/types/common";

export const getAllSpecialties = async (filterOptions?: SearchParams) => {
  try {
    const query = new URLSearchParams();

    // Always apply these
    query.set("sortOrder", filterOptions?.sortOrder || "desc");
    query.set("search", filterOptions?.search || "");
    query.set("city", filterOptions?.city || "");

    // Conditionally apply page
    if (filterOptions?.page !== undefined) {
      query.set("page", String(filterOptions.page));
    }

    // Conditionally apply limit
    if (filterOptions?.limit !== undefined) {
      query.set("limit", String(filterOptions.limit));
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/specialties?${query.toString()}`,
      { method: "GET" }
    );

    return await res.json();
  } catch (error) {
    return error;
  }
};
