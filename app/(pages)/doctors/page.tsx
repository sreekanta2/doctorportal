import DoctorFilterForm from "@/components/doctor-filter-form";
import { Hero } from "@/components/hero";
import { NotFound } from "@/components/not-found";
import Pagination from "@/components/PaginationComponents";
import { getAllDoctors } from "@/config/doctor/doctors";
import { DoctorWithRelations } from "@/types";

import { Gender } from "@/types/common";

import { Metadata } from "next";
import { Suspense } from "react";
import DoctorCard from "./components/doctor-card";
import DoctorCardSkeleton from "./components/doctor-card-skeleton";

// Structured Data Component
function StructuredData({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Generate dynamic metadata
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}): Promise<Metadata> {
  const specialty = searchParams.specialization || "";
  const location = searchParams.city || "";

  return {
    title: `${specialty ? specialty + " " : ""}Doctors Near ${
      location || "You"
    } | Book Online`,
    description: `Find and book appointments with ${
      specialty || "qualified"
    } doctors ${
      location ? "in " + location : "near you"
    }. Read patient reviews and ratings.`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_URL}/doctors${
        specialty || location
          ? "?" + new URLSearchParams(searchParams).toString()
          : ""
      }`,
    },
    openGraph: {
      title: `${specialty ? specialty + " " : ""}Doctors Near ${
        location || "You"
      }`,
      description: `Find and book ${
        specialty || "medical"
      } specialists online ${location ? "in " + location : ""}`,
    },
    twitter: {
      title: `${specialty ? specialty + " " : ""}Doctors Near ${
        location || "You"
      }`,
    },
    keywords: [
      "find doctors",
      "book doctor appointment",
      ...(specialty ? [specialty + " near me"] : []),
      ...(location ? ["doctors in " + location] : []),
    ],
  };
}

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const page = (searchParams?.page as string) || "1";
  const limit = (searchParams?.limit as string) || "10";
  const search = searchParams?.search as string | undefined;
  const gender = searchParams?.gender as Gender | undefined;
  const city = searchParams?.city as string | undefined;
  const maxRating = searchParams?.maxRating as string | "5";
  const minRating = searchParams?.minRating as string | "0";
  const specialization = searchParams?.specialization as string | undefined;

  const result = await getAllDoctors({
    page,
    limit,
    search,
    gender,
    city,
    specialization,
    maxRating,
    minRating,
  });

  if (!result.success) {
    return (
      <div className="text-red-600 dark:text-red-400 p-4">
        Error fetching doctors: {result.error}
      </div>
    );
  }

  const doctors = result?.data;
  const pagination = result?.meta?.pagination;

  return (
    <div className="bg-background min-h-screen">
      <Hero
        title={<span className="text-primary">Search Doctor</span>}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Doctors" }]}
      />

      <section className="bg-card/50 backdrop-blur-lg shadow-md dark:bg-card/70">
        <div className="container   relative   py-8">
          <DoctorFilterForm />

          <article className="w-full">
            <header>
              <h1 className="text-lg font-semibold">
                Showing{" "}
                <span className="text-primary font-bold">
                  {pagination?.total}
                </span>{" "}
                Doctors Matching Your Criteria
              </h1>
              <p className="text-base text-default-600 mt-1">
                {specialization && (
                  <span>
                    Specialty: <strong>{specialization}</strong>{" "}
                  </span>
                )}
                {city && (
                  <span>
                    Location: <strong>{city}</strong>
                  </span>
                )}
              </p>
            </header>

            <div className="my-4 space-y-4">
              {doctors.map((doctor: DoctorWithRelations) => (
                <Suspense key={doctor.id} fallback={<DoctorCardSkeleton />}>
                  <DoctorCard doctor={doctor} profileButton />
                </Suspense>
              ))}

              {/* {doctorsResponse?.pagination?.totalRecords >
                doctorsResponse?.pagination?.perPage && ( */}
              {pagination && (
                <nav className="mt-24" aria-label="Pagination navigation">
                  {pagination?.total > pagination?.limit && (
                    <Pagination
                      currentPage={pagination?.page}
                      totalPages={pagination?.totalPages}
                    />
                  )}
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

          <StructuredData
            data={{
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: doctors.map((doctor: DoctorWithRelations) => {
                return {
                  "@type": "ListItem",
                  position: 1,
                  item: {
                    "@type": "Physician",
                    name: ` ${doctor?.user?.name}`,
                    url: `${process.env.NEXT_PUBLIC_API_URL}/doctors/${doctor?.id}`,
                    image: `${
                      doctor?.user?.image || process.env.NEXT_PUBLIC_API_URL
                    }/default-doctor.png`,
                    medicalSpecialty:
                      doctor?.specialization || "General Practice",
                    hospitalAffiliation: doctor?.hospital || "",
                    address: {
                      "@type": "PostalAddress",
                      addressLocality: `${doctor?.city}` || "",
                      addressRegion: `${doctor?.state}` || "",
                      addressCountry: `${doctor?.country}` || "",
                      streetAddress: doctor?.street,
                    },
                    aggregateRating: {
                      "@type": "AggregateRating",
                      ratingValue: doctor?.averageRating || 0,
                      reviewCount: doctor?.reviewsCount || 0,
                      bestRating: "5",
                    },
                  },
                };
              }),
            }}
          />
        </div>
      </section>
    </div>
  );
}
