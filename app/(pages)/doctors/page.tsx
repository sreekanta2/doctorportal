import DoctorFilterForm from "@/components/doctor-filter-form";
import { Hero } from "@/components/hero";
import { Gender } from "@/types/common";
import { Suspense } from "react";
import DoctorCardSkeleton from "./components/doctor-card-skeleton";
import DoctorsList from "./components/doctor-list";

export default function DoctorsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const page = (searchParams?.page as string) || "1";
  const limit = (searchParams?.limit as string) || "10";
  const search = searchParams?.search as string | undefined;
  const gender = searchParams?.gender as Gender | undefined;
  const city = searchParams?.city as string | undefined;
  const specialization = searchParams?.specialization as string | undefined;

  return (
    <div className="bg-background min-h-screen">
      <Hero
        title={<span className="text-primary">Search Doctor</span>}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Doctors" }]}
      />

      <section className="bg-card/50 backdrop-blur-lg shadow-md dark:bg-card/70">
        <div className="container relative py-8">
          <DoctorFilterForm />

          {/* ✅ Navigation is instant, fallback shows immediately */}
          <Suspense
            fallback={
              <div className="grid gap-4 my-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <DoctorCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <DoctorsList
              page={page}
              limit={limit}
              search={search}
              gender={gender}
              city={city}
              specialization={specialization}
            />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
