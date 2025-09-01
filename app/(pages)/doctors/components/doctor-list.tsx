import Pagination from "@/components/PaginationComponents";
import { NotFound } from "@/components/not-found";
import { getAllDoctors } from "@/config/doctor/doctors";
import { DoctorWithRelations } from "@/types";
import { Gender } from "@/types/common";
import DoctorCard from "./search-doctor-card";

export default async function DoctorsList({
  page,
  limit,
  search,
  gender,
  city,
  specialization,
}: {
  page: string;
  limit: string;
  search?: string;
  gender?: Gender;
  city?: string;
  specialization?: string;
}) {
  const result = await getAllDoctors({
    page,
    limit,
    search,
    gender,
    city,
    specialization,
  });

  if (!result.success) {
    return (
      <div className="text-red-600 dark:text-red-400 p-4">
        Error fetching doctors: {result.error}
      </div>
    );
  }

  const doctors = result.data;
  const pagination = result.meta?.pagination;

  return (
    <article className="w-full">
      <header>
        <h1 className="text-lg font-semibold">
          Showing{" "}
          <span className="text-primary font-bold">{pagination?.total}</span>{" "}
          Doctors Matching Your Criteria
        </h1>
      </header>

      <div className="my-4 space-y-4">
        {doctors.map((doctor: DoctorWithRelations) => (
          <DoctorCard key={doctor.id} doctor={doctor} profileButton />
        ))}

        {pagination && pagination.total > pagination.limit && (
          <nav className="mt-24" aria-label="Pagination navigation">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
            />
          </nav>
        )}

        {doctors.length === 0 && (
          <NotFound
            title="Doctors are not found"
            description="Filter Other options"
          />
        )}
      </div>
    </article>
  );
}
