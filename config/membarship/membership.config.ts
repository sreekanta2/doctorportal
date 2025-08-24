import { SearchParams } from "@/types/common";

export const getAllMembershipDoctorWithClinicAdminId = async ({
  adminId,
  searchParams,
}: {
  adminId: string;
  searchParams?: SearchParams;
}) => {
  const query = new URLSearchParams({
    page: searchParams?.page?.toString() || "1",
    limit: searchParams?.limit?.toString() || "10",
    sortBy: searchParams?.sortBy || "createdAt",
    sortOrder: searchParams?.sortOrder || "desc",
  });
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/api/membership/${adminId}?${query.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  return await res.json();
};
