import DoctorFilterForm from "@/components/doctor-filter-form";
import { Hero } from "@/components/hero";
import { NotFound } from "@/components/not-found";
import Pagination from "@/components/PaginationComponents";
import { User } from "@/components/svg";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { getAllDoctors } from "@/config/doctor/doctors";
import { DoctorWithRelations } from "@/types";

import { Gender } from "@/types/common";

import {
  BadgeCheck,
  Bookmark,
  Building2,
  Globe,
  GraduationCap,
  Stethoscope,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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
  const specialty = searchParams.specialty || "";
  const location = searchParams.location || "";

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
                <article
                  key={doctor.id}
                  className="border bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md dark:bg-gray-900 dark:border-gray-800"
                  itemScope
                  itemType="https://schema.org/Physician"
                >
                  <meta
                    itemProp="@id"
                    content={`${process.env.NEXT_PUBLIC_API_URL}/doctors/${doctor.id}`}
                  />
                  <meta
                    itemProp="medicalSpecialty"
                    content={doctor.specialization || "General Practice"}
                  />

                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row gap-5">
                      {/* Doctor Image */}
                      <div className="relative h-28 w-28 min-w-[112px] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {doctor?.user?.image ? (
                          <Image
                            src={doctor?.user?.image}
                            alt={`Dr. ${doctor?.user?.name}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 112px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                            <User className="  text-gray-400 dark:text-gray-500" />
                          </div>
                        )}
                      </div>

                      {/* Doctor Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <h2
                            className="text-xl font-semibold text-gray-900 dark:text-white"
                            itemProp="name"
                          >
                            <Link
                              href={`/doctors/${doctor?.id}`}
                              className="hover:text-primary hover:underline"
                              itemProp="url"
                            >
                              {doctor?.user?.name}
                            </Link>
                          </h2>
                          <BadgeCheck className="w-5 h-5 text-blue-500" />
                        </div>

                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <p
                            className="text-gray-700 dark:text-gray-300"
                            itemProp="description"
                          >
                            {doctor.specialization ||
                              "MBBS, BCS (Health), MS (Ortho)"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <p
                            className="text-gray-700 dark:text-gray-300"
                            itemProp="affiliation"
                          >
                            {doctor.hospital ||
                              "Mymensingh Medical College & Hospital"}
                          </p>
                        </div>

                        {/* {doctor.languages && (
                          <div className="flex items-center gap-2 pt-1">
                            <Languages className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {doctor.languages}
                            </span>
                          </div>
                        )} */}

                        <div className="pt-2 flex gap-3">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                          >
                            <Link href="#">
                              <Globe className="w-4 h-4" />
                              Website
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                          >
                            <Link href={`/doctors/${doctor?.id}`}>
                              <Building2 className="w-4 h-4" />
                              Chambers
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t px-5 py-3 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-800">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center flex-wrap gap-3">
                        <div className="flex items-center gap-1.5">
                          <Rating
                            value={doctor.averageRating || 4}
                            readOnly
                            className="gap-x-1 max-w-[110px]"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Reviews ({43})
                          </span>
                        </div>

                        {/* {doctor.experience && (
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {doctor.experience}+ years
                            </span>
                          </div>
                        )} */}
                      </div>

                      <Button
                        variant="soft"
                        size="sm"
                        className="text-gray-500 dark:text-gray-400"
                      >
                        <Bookmark className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </article>
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
