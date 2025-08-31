import DoctorFilterForm from "@/components/doctor-filter-form";
import { NotFound } from "@/components/not-found";

import { getAllAdminDoctors } from "@/config/admin";
import { DoctorWithRelations } from "@/types";
import { Gender } from "@/types/common";
import { default as DoctorDialogAdd } from "./components/doctor-add-dialog";
import DoctorList from "./components/doctor-list";

interface DoctorPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function DoctorPage({ searchParams }: DoctorPageProps) {
  const page = String(searchParams?.page || 1);
  const limit = String(searchParams?.limit || 10);
  const search = searchParams?.search as string | undefined;
  const gender = searchParams?.gender as Gender | undefined;
  const city = searchParams?.city as string | undefined;
  const specialization = searchParams?.specialization as string | undefined;

  // Fetch doctors
  const result = await getAllAdminDoctors({
    page,
    limit,
    search,
    gender,
    city,
    specialization,
  });

  const doctors: DoctorWithRelations[] = result.data;
  const pagination = result.meta?.pagination;

  return (
    <div className="w-full bg-card/50 p-4 rounded-lg shadow-md space-y-6">
      {/* Header & Add Doctor Button */}
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Doctors</h1>
        <DoctorDialogAdd />
      </header>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Filter Form */}
      <DoctorFilterForm />

      {/* Doctor Table */}
      {doctors?.length === 0 ? (
        <NotFound title="No Doctors Found" />
      ) : (
        <DoctorList doctors={doctors} pagination={pagination} />
      )}
    </div>
  );
}
