import { NotFound } from "@/components/not-found";

import { getAllCities } from "@/config/city";
import CitiesPageList from "./components/cities-list";
import CityCreateDialog from "./components/create-dialog";

interface ClinicPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function CitiesPage({ searchParams }: ClinicPageProps) {
  const page = String(searchParams?.page || 1);
  const limit = String(searchParams?.limit || 10);
  const search = searchParams?.search as string | undefined;

  // Fetch clinics
  const result = await getAllCities({ search, page, limit });
  const cities = result?.data || [];
  const pagination = result?.meta?.pagination;
  return (
    <div className="w-full bg-card/50 p-4 rounded-lg shadow-md space-y-6">
      {/* Header & Add Clinic Button */}
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Cities</h1>
        <CityCreateDialog />
      </header>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Doctor Table */}
      {cities?.length === 0 ? (
        <NotFound title="No cities Found" />
      ) : (
        <CitiesPageList cities={cities} pagination={pagination} />
      )}
    </div>
  );
}
