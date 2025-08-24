import { AppError } from "@/lib/actions/actions-error-response";

export async function getMedicalHistoryProfileById(
  id: string,
  page: number,
  limit: number
) {
  if (!id) {
    throw new AppError("Unauthorized user!");
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/medical-history?id=${id}&page=${page}&limit=${limit}`,
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
