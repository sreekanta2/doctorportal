import { NotFound } from "@/components/not-found";

import { getAllSpecialties } from "@/config/specialties";
import SpecialtiesCreateDialog from "./components/create-dialog";
import SpecialtiesList from "./components/specialties-list";

interface ClinicPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function SpecialtiesPage({
  searchParams,
}: ClinicPageProps) {
  const page = String(searchParams?.page || 1);
  const limit = String(searchParams?.limit || 10);
  const search = searchParams?.search as string | undefined;

  // Fetch clinics
  const result = await getAllSpecialties({ search, page, limit });
  const specialties = result?.data || [];
  const pagination = result?.meta?.pagination;
  return (
    <div className="w-full bg-card/50 p-4 rounded-lg shadow-md space-y-6">
      {/* Header & Add Clinic Button */}
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Specialties</h1>
        <SpecialtiesCreateDialog />
      </header>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Doctor Table */}
      {specialties?.length === 0 ? (
        <NotFound title="No specialties Found" />
      ) : (
        <SpecialtiesList specialties={specialties} pagination={pagination} />
      )}
    </div>
  );
}
