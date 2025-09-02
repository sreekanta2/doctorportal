import Pagination from "@/components/PaginationComponents";
import { User, Users } from "@/components/svg";
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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
function ClinicsStructuredData({
  clinics,
}: {
  clinics: ClinicWithRelations[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_API_URL}/clinics`,
    },
    itemListElement: clinics?.map((clinic, index) => {
      // Get a list of unique specialties from the doctors in the clinic
      const specialties = Array.from(
        new Set(
          clinic.memberships
            ?.map((m) => m.doctor?.specialization)
            .filter(Boolean)
        )
      );

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "MedicalClinic",
          name: clinic?.user?.name || "Unknown Clinic",
          url: `${process.env.NEXT_PUBLIC_API_URL}/clinics/${clinic.id}`,
          image: clinic?.user?.image,
          telephone: clinic?.phoneNumber,
          address: {
            "@type": "PostalAddress",
            addressLocality: clinic?.city || "",
            addressCountry: clinic?.country || "",
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
          // Use the 'medicalSpecialty' property to describe the clinic's services
          medicalSpecialty:
            specialties.length > 0 ? specialties : ["General Practice"],
          // Optionally, list the doctors using 'hasPart'
          hasPart: clinic.memberships?.map((m) => ({
            "@type": "Physician",
            name: `Dr. ${m?.doctor?.user?.name}`,
            url: `${process.env.NEXT_PUBLIC_API_URL}/doctors/${m?.doctor?.id}`,
            image: m?.doctor?.user?.image,
            medicalSpecialty: m?.doctor?.specialization,
          })),
          // Add opening hours
          openingHours: `Mo-Su ${
            clinic?.openingHour
              ? "9:00 AM-" + clinic.openingHour
              : "9:00 AM-8:00 PM"
          }`,
        },
      };
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

export default async function ClinicList({
  page,
  limit,
  search,

  city,
}: {
  page: string;
  limit: string;
  search?: string;

  city?: string;
  specialization?: string;
}) {
  const result = await getAllClinics("clinics", {
    page,
    limit,
    search,
    city,
  });
  const clinics: ClinicWithRelations[] = result?.data;
  const pagination: PaginationMeta = result.meta?.pagination;
  return (
    <div>
      {" "}
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
            {search && (
              <span>
                Name: <strong>{search}</strong>
              </span>
            )}
          </p>
          <p className="text-sm text-default-600 mt-1">
            {city && (
              <span>
                Location: <strong>{city}</strong>
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

              <div className="flex flex-col md:flex-row p-4 gap-4 ">
                {/* Clinic Image */}
                <div className="w-full h-72 sm:w-64  sm:h-64 flex-shrink-0 relative ">
                  <div className="absolute top-3 left-3 z-10">
                    <div className="inline-flex items-center px-3 py-1  gap-1 rounded-full bg-white/90 text-primary-700 text-sm font-medium shadow-sm">
                      <span className=" bg-blue-50 rounded-lg dark:bg-gray-800">
                        <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </span>
                      Verified
                    </div>
                  </div>

                  {clinic?.user?.image ? (
                    <Image
                      src={clinic?.user?.image}
                      alt={`${clinic?.user?.name} clinic`}
                      fill // ✅ makes it fill the parent div
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 100vw, 256px"
                      itemProp="image"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center rounded-lg">
                      <Building2 className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>

                {/* Clinic Info */}
                <div className="flex-1 ">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold" itemProp="name">
                          <Link
                            href={`/clinics/${clinic.id}`}
                            itemProp="url"
                            className="hover:text-primary-600 transition-colors"
                          >
                            {clinic?.user?.name
                              ? clinic?.user?.name.charAt(0).toUpperCase() +
                                clinic?.user?.name?.slice(1)
                              : ""}
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
                        <div className="p-2 bg-blue-50 rounded-lg dark:bg-gray-800">
                          <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span
                          className="text-sm text-gray-600"
                          itemProp="address"
                        >
                          {clinic?.city}, {clinic?.country}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-lg dark:bg-gray-800">
                          <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
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
                      <div className="mt-2 text-sm text-gray-600 flex  items-center gap-2">
                        <span className="p-2 bg-blue-50 rounded-lg dark:bg-gray-800">
                          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </span>
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
                              Dr.{" "}
                              {doctor?.doctor?.user?.name
                                ? doctor?.doctor?.user?.name
                                    .charAt(0)
                                    .toUpperCase() +
                                  doctor?.doctor?.user?.name.slice(1)
                                : ""}
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
                  <div className="mt-6 w-full flex flex-wrap gap-3">
                    <Button
                      asChild
                      variant="soft"
                      size="sm"
                      className=" w-full sm:w-fit min-w-[200px]  "
                    >
                      <Link href={`/book-appointment?clinic=${clinic.id}`}>
                        <Globe className="w-4 h-4 mr-2" />
                        Websites
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="w-full sm:w-fit flex gap-2 items-center min-w-[200px]"
                    >
                      <Users className="w-4 h-4 " />
                      <Link href={`/clinics/${clinic.id}`}>All Doctors</Link>
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
      <ClinicsStructuredData clinics={clinics} />
    </div>
  );
}
