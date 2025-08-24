import Pagination from "@/components/PaginationComponents";
import { User } from "@/components/svg";
import { Button } from "@/components/ui/button";

import { getClinics } from "@/config/clinic";
import {
  Building2,
  CheckCircle,
  Clock,
  Globe,
  MapPin,
  Plus,
  Star,
  Users,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "../../../components/hero";
import FilterForm from "./components/clinic-filtering-form";

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
      canonical: `https://yourdomain.com/doctors${
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
  searchParams: { [key: string]: string };
}) {
  const page = parseInt(searchParams.page || "1", 10);
  const specialty = searchParams.specialty || "";
  const name = searchParams.name || "";
  const gender = searchParams.gender || "";
  const language = searchParams.language || "";
  const location = searchParams.location || "";

  const filter = { name, gender, language, specialty, location };
  const limit = 3;

  const clinicsResponse = await getClinics({ page, limit, filter });

  return (
    <div className="bg-background min-h-screen">
      <Hero
        title={<span className="text-primary">Search Clinics</span>}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Clinics" }]}
      />

      <section className="bg-card/50 backdrop-blur-lg shadow-md dark:bg-card/70">
        <div className="container   relative   py-8">
          <FilterForm />

          <article className="w-full">
            <header>
              <h1 className="text-lg font-semibold">
                Showing{" "}
                <span className="text-primary font-bold">
                  {clinicsResponse?.pagination?.totalRecords}
                </span>{" "}
                Clinics Matching Your Criteria
              </h1>
              <p className="text-sm text-default-600 mt-1">
                {specialty && (
                  <span>
                    Specialty: <strong>{specialty}</strong>{" "}
                  </span>
                )}
                {location && (
                  <span>
                    Location: <strong>{location}</strong>
                  </span>
                )}
              </p>
            </header>

            <div className="my-4 space-y-4">
              {clinicsResponse?.data?.map((clinic: any) => (
                <article
                  key={clinic.id}
                  className="border bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  itemScope
                  itemType="https://schema.org/MedicalClinic"
                >
                  <meta
                    itemProp="@id"
                    content={`https://yourdomain.com/clinics/${clinic.id}`}
                  />
                  <meta
                    itemProp="medicalSpecialty"
                    content={
                      clinic.specialties?.join(", ") || "Multi-Specialty"
                    }
                  />

                  <div className="flex flex-col md:flex-row">
                    {/* Clinic Image */}
                    <div className="w-full md:w-64 flex-shrink-0 relative">
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 text-primary-700 text-sm font-medium shadow-sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verified
                        </span>
                      </div>
                      {clinic.image ? (
                        <Image
                          src={clinic.image}
                          alt={`${clinic.name} clinic`}
                          width={256}
                          height={192}
                          className="w-full h-64 object-cover"
                          itemProp="image"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center">
                          <Building2 className="w-16 h-16 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Clinic Info */}
                    <div className="flex-1 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2
                              className="text-xl font-semibold"
                              itemProp="name"
                            >
                              <Link
                                href={`/clinics/${clinic.id}`}
                                itemProp="url"
                                className="hover:text-primary-600 transition-colors"
                              >
                                {clinic.name}
                              </Link>
                            </h2>
                            {clinic.premium && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                <Star className="w-3 h-3 mr-1 fill-amber-500" />
                                Premium
                              </span>
                            )}
                          </div>

                          <div className="mt-1 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span
                              className="text-sm text-gray-600"
                              itemProp="address"
                            >
                              {clinic.address}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="font-medium">
                              {clinic.rating || 4.7}
                            </span>
                            <span className="text-gray-500 text-sm">
                              ({clinic.reviewCount || 86})
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 inline mr-1" />
                            Open until {clinic.hours?.close || "8:00 PM"}
                          </div>
                        </div>
                      </div>

                      {/* Doctors Preview */}
                      <div className="mt-4 pt-4 border-t">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                          Available Doctors ({clinic.doctorCount || 12}+
                          specialists)
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {clinic.featuredDoctors
                            ?.slice(0, 3)
                            .map((doctor: any) => (
                              <div
                                key={doctor.id}
                                className="flex items-center gap-2"
                              >
                                {doctor?.image ? (
                                  <Image
                                    src={doctor.image}
                                    alt={`Dr. ${doctor.name}`}
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-400" />
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium">
                                    Dr. {doctor.name.split(" ")[0]}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {doctor.specialty}
                                  </p>
                                </div>
                              </div>
                            ))}
                          {clinic.doctorCount > 3 && (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <Plus className="w-4 h-4 text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-600">
                                {clinic.doctorCount - 3}+ more
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="flex-1 min-w-[120px]"
                        >
                          <Link href={`/clinics/${clinic.id}`}>
                            <Users className="w-4 h-4 mr-2" />
                            View All Doctors
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="flex-1 min-w-[120px]"
                        >
                          <Link href={`/book-appointment?clinic=${clinic.id}`}>
                            <Globe className="w-4 h-4 mr-2" />
                            Websites
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {clinicsResponse?.pagination?.totalRecords >
                clinicsResponse?.pagination?.perPage && (
                <nav className="mt-24" aria-label="Pagination navigation">
                  <Pagination
                    scrollTarget="top"
                    currentPage={clinicsResponse?.pagination?.currentPage}
                    totalPages={clinicsResponse?.pagination?.totalPages}
                  />
                </nav>
              )}
            </div>
          </article>

          <StructuredData
            data={{
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: clinicsResponse?.data?.map(
                (doctor: any, index: number) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  item: {
                    "@type": "Physician",
                    name: `Dr. ${doctor?.user?.name || doctor?.displayName}`,
                    url: `https://yourdomain.com/doctors/${doctor.id}`,
                    image: doctor?.user?.image,
                    medicalSpecialty:
                      doctor.specialties?.[0] || "General Practice",
                    hospitalAffiliation:
                      doctor.hospital ||
                      "Mymensingh Medical College & Hospital",
                    address: {
                      "@type": "PostalAddress",
                      addressLocality: "New York",
                      addressRegion: "NY",
                      addressCountry: "USA",
                    },
                    aggregateRating: {
                      "@type": "AggregateRating",
                      ratingValue: doctor.rating || 4,
                      reviewCount: doctor.reviewCount || 43,
                      bestRating: "5",
                    },
                    priceRange: "$$$",
                  },
                })
              ),
            }}
          />
        </div>
      </section>
    </div>
  );
}
