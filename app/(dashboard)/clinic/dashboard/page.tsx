import { getAllMembershipDoctorWithClinicAdminId } from "@/config/membarship/membership.config";
import { SearchParams } from "@/types/common";

import { authOptions } from "@/app/api/auth/option";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DoctorPageView from "./components/page-view";

interface PageProps {
  searchParams?: SearchParams;
}

export default async function MembershipDoctors({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return redirect("/sign-in");

  const membershipDoctors = await getAllMembershipDoctorWithClinicAdminId({
    adminId: session.user.id,
    searchParams,
  });

  return (
    <DoctorPageView
      membershipDoctors={membershipDoctors?.data || []}
      pagination={membershipDoctors.meta?.pagination}
    />
  );
}
