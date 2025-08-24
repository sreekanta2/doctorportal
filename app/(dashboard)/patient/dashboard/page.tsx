import { SearchParams } from "@/types/common";

import { authOptions } from "@/app/api/auth/option";
import { getMedicalHistoryProfileById } from "@/config/medical-history/medical-history";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DoctorPageView from "./components/page-view";

interface PageProps {
  searchParams?: SearchParams;
}

export default async function MembershipDoctors({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return redirect("/sign-in");

  const medicalHistory = await getMedicalHistoryProfileById(
    session.user.id,
    1,
    10
  );

  const pagination = medicalHistory?.meta;

  return (
    <DoctorPageView
      medicalHistory={medicalHistory?.data || []}
      pagination={pagination}
    />
  );
}
