import { NotFound } from "@/components/not-found";

import ClinicFilterForm from "@/components/clinic-filter-from";

import { getAllClinics } from "@/config/clinic/clinic";
import { ClinicWithRelations } from "@/types";
import ClinicList from "./components/clinics-list";
import ClinicCreateDialog from "./components/profile-form";

interface ClinicPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ClinicPage({ searchParams }: ClinicPageProps) {
  const page = String(searchParams?.page || 1);
  const limit = String(searchParams?.limit || 10);
  const search = searchParams?.search as string | undefined;
  const city = searchParams?.city as string | undefined;

  // Fetch clinics
  const result = await getAllClinics({
    page,
    limit,
    search,
    city,
  });
  const clinics: ClinicWithRelations[] = result.data;
  const pagination = result.meta?.pagination;

  return (
    <div className="w-full bg-card/50 p-4 rounded-lg shadow-md space-y-6">
      {/* Header & Add Clinic Button */}
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Clinics</h1>
        <ClinicCreateDialog />
      </header>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Filter Form */}
      <ClinicFilterForm />

      {/* Doctor Table */}
      {clinics?.length === 0 ? (
        <NotFound title="No clinics Found" />
      ) : (
        <ClinicList clinics={clinics} pagination={pagination} />
      )}
    </div>
  );
}
