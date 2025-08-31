import LimitSelect from "@/components/limit-select";
import Pagination from "@/components/PaginationComponents";
import SearchInput from "@/components/SearchInput";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getAllAdminPatients } from "@/config/admin";
import PatientsList from "./components/patients-list";

export default async function AdminPatientPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const page = String(searchParams?.page || 1);
  const limit = String(searchParams?.limit || 10);
  const search = searchParams?.search as string | undefined;

  // Fetch doctors data based on page and limit
  const patientsResponse = await getAllAdminPatients({ page, limit, search });
  const patients = patientsResponse.data;
  const pagination = patientsResponse.meta?.pagination;
  return (
    <div className="border p-6 bg-card rounded-md space-y-4">
      <h1 className="text-2xl font-bold   bg-card/50 text-default-600     ">
        Patients List
      </h1>
      <hr />
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <SearchInput searchParamKey="search" />
        <LimitSelect />
      </div>
      <ScrollArea className="pb-8  lg:pb-0">
        <PatientsList patients={patients} />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {pagination?.total > pagination?.limit && (
        <div className="mt-24">
          <Pagination
            currentPage={pagination?.page}
            totalPages={pagination?.totalPages}
          />
        </div>
      )}
    </div>
  );
}
