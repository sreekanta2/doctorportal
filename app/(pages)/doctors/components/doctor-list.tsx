import Pagination from "@/components/PaginationComponents";
import { NotFound } from "@/components/not-found";
import { getAllDoctors } from "@/config/doctor/doctors";
import { DoctorWithRelations } from "@/types";
import { Gender } from "@/types/common";
import { Metadata } from "next";
import DoctorCard from "./search-doctor-card";
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
    robots: {
      index: true,
      follow: true,
    },
  };
}

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
        {doctors.length > 0 && (
          <StructuredData
            data={{
              "@context": "https://schema.org",
              "@type": "ItemList",

              itemListElement: doctors.map(
                (doctor: DoctorWithRelations, index: number) => {
                  return {
                    "@type": "ListItem",
                    position:
                      ((pagination?.page || 1) - 1) *
                        (pagination?.limit || 10) +
                      index +
                      1,
                    item: {
                      "@type": "Physician",
                      name: `Dr. ${doctor?.user?.name}`,
                      url: `${process.env.NEXT_PUBLIC_API_URL}/doctors/${doctor?.id}`,
                      image:
                        doctor?.user?.image ||
                        `${process.env.NEXT_PUBLIC_API_URL}/default-doctor.png`,
                      medicalSpecialty: doctor?.specialization,
                      hospitalAffiliation: doctor?.hospital || undefined,
                      address: {
                        "@type": "PostalAddress",
                        addressLocality: doctor?.city || undefined,
                        addressCountry: doctor?.country || undefined,
                      },
                      aggregateRating: {
                        "@type": "AggregateRating",
                        ratingValue: doctor?.averageRating || 0,
                        reviewCount: doctor?.reviewsCount || 0,
                        bestRating: "5",
                        worstRating: "1",
                      },

                      gender: doctor?.gender,
                    },
                  };
                }
              ),
            }}
          />
        )}
      </div>
    </article>
  );
}
