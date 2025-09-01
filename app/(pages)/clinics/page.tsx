import { Suspense } from "react";
import { Hero } from "../../../components/hero";
import DoctorCardSkeleton from "../doctors/components/doctor-card-skeleton";
import ClinicFilterForm from "./components/clinic-filtering-form";
import ClinicList from "./components/clinic-list";

export default async function ClinicsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const page = String(searchParams.page || "1");
  const limit = String(searchParams.limit || "10");
  const search = searchParams.search || "";
  const location = searchParams.city || "";

  return (
    <div className="bg-background min-h-screen">
      <Hero
        title={<span className="text-primary">Search Clinics</span>}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Clinics" }]}
      />

      <section className="bg-card/50 backdrop-blur-lg shadow-md dark:bg-card/70">
        <div className="container relative py-8">
          <ClinicFilterForm />
          <Suspense
            fallback={
              <div className="grid gap-4 my-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <DoctorCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <ClinicList
              page={page}
              limit={limit}
              search={search}
              city={location}
            />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
