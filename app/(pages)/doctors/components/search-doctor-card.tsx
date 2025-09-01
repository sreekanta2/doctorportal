import { User } from "@/components/svg";
import { Button } from "@/components/ui/button";
import { DoctorWithRelations } from "@/types";
import {
  BadgeCheck,
  Building,
  Globe,
  Plus,
  Star,
  Stethoscope,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DoctorCard({
  doctor,
  profileButton = false,
}: {
  doctor: DoctorWithRelations;
  profileButton?: boolean;
}) {
  return (
    <article
      key={doctor?.id}
      className="border bg-white rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-xl dark:bg-gray-900 dark:border-gray-800 group"
      itemScope
      itemType="https://schema.org/Physician"
    >
      <meta
        itemProp="@id"
        content={`${process.env.NEXT_PUBLIC_API_URL}/doctors/${doctor?.id}`}
      />
      <meta
        itemProp="medicalSpecialty"
        content={doctor?.specialization || "General Practice"}
      />

      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Doctor Image */}
          <div className="relative  w-64 h-64      min-w-[128px] rounded-xl border-2 border-white shadow-md overflow-hidden group-hover:scale-105 transition-transform duration-300">
            {doctor?.user?.image ? (
              <Image
                src={doctor?.user?.image}
                alt={`Dr. ${doctor?.user?.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 128px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700">
                <User className="w-20 h-20 text-gray-400 dark:text-gray-500" />
              </div>
            )}

            {/* Verified Badge */}
            <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full">
              <BadgeCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Doctor Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-2 ">
              <div className="w-full">
                <h2
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-1"
                  itemProp="name"
                >
                  <Link
                    href={`/doctors/${doctor?.id}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    itemProp="url"
                  >
                    Dr.{" "}
                    {doctor?.user?.name
                      ? doctor.user.name.charAt(0).toUpperCase() +
                        doctor.user.name.slice(1)
                      : ""}
                  </Link>
                </h2>

                <div className="flex items-center gap-2 mb-1 ">
                  <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                    {doctor?.specialization.toUpperCase() ||
                      "General Physician"}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm sm:text-base   text-blue-800  font-medium px-2.5 py-0.5 rounded  ">
                    {doctor?.degree || ""}
                  </p>
                </div>
              </div>

              {/* Rating & Price */}
              <div className="flex   min-w-fit flex-col md:items-end">
                <div className="flex items-center gap-2    md:items-end">
                  <span className="flex items-center bg-amber-100 text-amber-800 text-sm font-semibold px-2 py-1 rounded-full dark:bg-amber-900 dark:text-amber-300">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500 mr-1" />
                    {doctor?.averageRating || 0}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 sm:mb-2">
                    ({doctor?.reviewsCount || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Details */}

            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg dark:bg-gray-800">
                <Stethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h1
                className="text-gray-700 font-medium dark:text-gray-300"
                itemProp="description"
              >
                {doctor?.hospital || "MBBS, BCS (Health), MS (Ortho)"}
              </h1>
            </div>
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                All Chambers ({doctor?.memberships?.length || 0}+ Clinics)
              </h3>
              <div className="flex flex-wrap gap-3">
                {doctor?.memberships?.slice(0, 3).map((doctor) => (
                  <div key={doctor?.id} className="flex items-center gap-2">
                    {doctor?.clinic?.user?.image ? (
                      <Image
                        src={doctor?.clinic?.user?.image}
                        alt={`Dr. ${doctor?.clinic?.user?.name}`}
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
                        {doctor?.clinic?.user?.name
                          ? doctor?.clinic?.user?.name.charAt(0).toUpperCase() +
                            doctor?.clinic?.user?.name.slice(1)
                          : ""}
                      </p>
                      {/* <p className="text-xs text-gray-500">
                        {doctor?.clinic}
                      </p> */}
                    </div>
                  </div>
                ))}
                {doctor?.memberships?.length > 3 && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Plus className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      {doctor?.memberships?.length - 3}+ more
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Action Buttons */}
            <div className="  flex flex-wrap gap-3 mt-3 ">
              <Button
                asChild
                variant="soft"
                className="gap-2 w-full sm:w-fit rounded-full"
              >
                <Link href="#">
                  <Globe className="w-4 h-4" />
                  Website
                </Link>
              </Button>
              {profileButton && (
                <Button
                  asChild
                  className="gap-2 w-full sm:w-fit  rounded-full bg-blue-600 hover:bg-blue-700"
                >
                  <Link href={`/doctors/${doctor?.id}`}>
                    <Building className="w-4 h-4" />
                    All Chambers
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
