import Pagination from "@/components/PaginationComponents";
import { User } from "@/components/svg";
import { Button } from "@/components/ui/button";

import { getAllClinics } from "@/config/clinic/clinic";
import { ClinicWithRelations } from "@/types";
import { PaginationMeta } from "@/types/common";
import {
  Building2,
  CheckCircle,
  Clock,
  Globe,
  MapPin,
  Phone,
  Plus,
  Star,
  Users,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "../../../components/hero";
import ClinicFilterForm from "./components/clinic-filtering-form";

// Structured Data Component
function StructuredData({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Generate Metadata for SEO
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}): Promise<Metadata> {
  const specialty = searchParams.specialty || "";
  const location = searchParams.city || "";
  const search = searchParams.search || "";

  const title = `${specialty ? specialty + " " : ""}Clinics ${
    location ? "in " + location : "Near You"
  } | Book Online & Reviews`;

  const description = `Find and book appointments with ${
    specialty || "top-rated"
  } clinics ${
    location ? "in " + location : "near you"
  }. Compare doctors, read reviews, check ratings, and book online instantly.`;

  const canonicalUrl = `${process.env.NEXT_PUBLIC_API_URL}/clinics${
    specialty || location || search
      ? "?" + new URLSearchParams(searchParams).toString()
      : ""
  }`;

  return {
    title,
    description,
    keywords: [
      "clinics near me",
      "book doctor appointment",
      "find medical clinics",
      `${specialty} clinic`,
      ...(specialty
        ? [`${specialty} specialists`, `${specialty} doctors`]
        : []),
      ...(location
        ? [`clinics in ${location}`, `${specialty} doctors in ${location}`]
        : []),
      ...(search ? [search + " clinic"] : []),
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: `${process.env.NEXT_PUBLIC_API_URL}`,
      images: [], // Optional: add default clinic image
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [], // Optional: add default clinic image
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ClinicsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const page = String(searchParams.page || "1");
  const limit = String(searchParams.limit || "10");
  const specialty = searchParams.specialty || "";
  const search = searchParams.search || "";
  const location = searchParams.city || "";

  const result = await getAllClinics("clinics", {
    page,
    limit,
    search,
    city: location,
  });
  const clinics: ClinicWithRelations[] = result?.data;
  const pagination: PaginationMeta = result.meta?.pagination;

  return (
    <div className="bg-background min-h-screen">
      <Hero
        title={<span className="text-primary">Search Clinics</span>}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Clinics" }]}
      />

      <section className="bg-card/50 backdrop-blur-lg shadow-md dark:bg-card/70">
        <div className="container relative py-8">
          <ClinicFilterForm />

          <article className="w-full">
            <header>
              <h1 className="text-lg font-semibold">
                Showing{" "}
                <span className="text-primary font-bold">
                  {pagination?.total || 0}
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
              {clinics?.map((clinic) => (
                <article
                  key={clinic.id}
                  className="border bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  itemScope
                  itemType="https://schema.org/MedicalClinic"
                >
                  <meta
                    itemProp="@id"
                    content={`${process.env.NEXT_PUBLIC_API_URL}/clinics/${clinic.id}`}
                  />
                  <meta
                    itemProp="location"
                    content={clinic?.city || "Multi-Specialty"}
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
                      {clinic?.user?.image ? (
                        <Image
                          src={clinic?.user?.image}
                          alt={`${clinic?.user?.name} clinic`}
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
                                {clinic?.user?.name || "Unknown"}
                              </Link>
                            </h2>
                            {clinic?.user?.emailVerified && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                <Star className="w-3 h-3 mr-1 fill-amber-500" />
                                Verified
                              </span>
                            )}
                          </div>

                          {/* Address */}
                          <div className="mt-1 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span
                              className="text-sm text-gray-600"
                              itemProp="address"
                            >
                              {clinic?.street}, {clinic?.city},{" "}
                              {clinic?.country}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span
                              className="text-sm text-gray-600"
                              itemProp="telephone"
                            >
                              {clinic?.phoneNumber}
                            </span>
                          </div>
                        </div>

                        {/* Ratings */}
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="font-medium">
                              {clinic?.averageRating || 0}
                            </span>
                            <span className="text-gray-500 text-sm">
                              ({clinic?.reviewsCount || 0})
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 inline mr-1" />
                            Open until {clinic?.openingHour || "8:00 PM"}
                          </div>
                        </div>
                      </div>

                      {/* Doctors Preview */}
                      <div className="mt-4 pt-4 border-t">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                          Available Doctors ({clinic?.memberships?.length || 0}+
                          specialists)
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {clinic?.memberships?.slice(0, 3).map((doctor) => (
                            <div
                              key={doctor?.id}
                              className="flex items-center gap-2"
                            >
                              {doctor?.doctor?.user?.image ? (
                                <Image
                                  src={doctor?.doctor?.user?.image}
                                  alt={`Dr. ${doctor?.doctor?.user?.name}`}
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
                                  Dr. {doctor?.doctor?.user?.name.split(" ")[0]}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {doctor?.doctor?.specialization}
                                </p>
                              </div>
                            </div>
                          ))}
                          {clinic?.memberships?.length > 3 && (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <Plus className="w-4 h-4 text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-600">
                                {clinic?.memberships?.length - 3}+ more
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

              {/* Pagination */}
              {pagination && pagination?.total > pagination?.limit && (
                <nav className="mt-24" aria-label="Pagination navigation">
                  <Pagination
                    currentPage={pagination?.page}
                    totalPages={pagination?.totalPages}
                  />
                </nav>
              )}
            </div>
          </article>

          {/* Structured Data */}
          <StructuredData
            data={{
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: clinics?.map((clinic, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "MedicalClinic",
                  "@id": `${process.env.NEXT_PUBLIC_API_URL}/clinics/${clinic.id}`,
                  url: `${process.env.NEXT_PUBLIC_API_URL}/clinics/${clinic.id}`,
                  name: clinic?.user?.name || "Unknown Clinic",
                  image: clinic?.user?.image,
                  telephone: clinic?.phoneNumber,
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: clinic?.street || "",
                    addressLocality: clinic?.city || "",
                    addressCountry: clinic?.country || "",
                    postalCode: clinic?.zipCode || "",
                  },
                  aggregateRating: clinic?.reviewsCount
                    ? {
                        "@type": "AggregateRating",
                        ratingValue: clinic?.averageRating || 0,
                        reviewCount: clinic?.reviewsCount,
                        bestRating: "5",
                        worstRating: "1",
                      }
                    : undefined,
                  medicalSpecialty:
                    clinic?.memberships?.[0]?.doctor?.specialization ||
                    "General Practice",
                  department: clinic?.memberships?.map((m) => ({
                    "@type": "Physician",
                    name: `Dr. ${m?.doctor?.user?.name}`,
                    image: m?.doctor?.user?.image,
                    medicalSpecialty: m?.doctor?.specialization,
                    url: `${process.env.NEXT_PUBLIC_API_URL}/doctors/${m?.doctor?.id}`,
                  })),
                },
              })),
            }}
          />
        </div>
      </section>
    </div>
  );
}
