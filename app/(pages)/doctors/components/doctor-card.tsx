import { User } from "@/components/svg";
import { Button } from "@/components/ui/button";
import { DoctorWithRelations } from "@/types";
import { BadgeCheck, Building2, Globe, Star, Stethoscope } from "lucide-react";
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

      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Doctor Image */}
          <div className="relative h-32 w-32 min-w-[128px] rounded-xl border-2 border-white shadow-md overflow-hidden group-hover:scale-105 transition-transform duration-300">
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
                <User className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
            )}

            {/* Verified Badge */}
            <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full">
              <BadgeCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Doctor Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4  ">
              <div>
                <h2
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-1"
                  itemProp="name"
                >
                  <Link
                    href={`/doctors/${doctor?.id}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    itemProp="url"
                  >
                    Dr. {doctor?.user?.name}
                  </Link>
                </h2>

                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                    {doctor?.specialization || "General Physician"}
                  </div>
                </div>
              </div>

              {/* Rating & Price */}
              <div className="flex flex-col md:items-end">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center bg-amber-100 text-amber-800 text-sm font-semibold px-2 py-1 rounded-full dark:bg-amber-900 dark:text-amber-300">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500 mr-1" />
                    {doctor?.averageRating || 0}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({doctor?.reviewsCount || 0} reviews)
                  </span>
                </div>

                {/* <div className="text-right">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Fee:{" "}
                  </span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {doctor?.memberships?.[0]?.fee || 0} ৳
                  </span>
                  {doctor?.memberships?.[0]?.discount > 0 && (
                    <div className="text-sm text-green-600 dark:text-green-400">
                      Save {doctor?.memberships?.[0]?.discount}৳
                    </div>
                  )}
                </div> */}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg dark:bg-gray-800">
                  <Stethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <p
                  className="text-gray-700 dark:text-gray-300"
                  itemProp="description"
                >
                  {doctor?.hospital || "MBBS, BCS (Health), MS (Ortho)"}
                </p>
              </div>

              {/* <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg dark:bg-gray-800">
                  <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <p
                  className="text-gray-700 dark:text-gray-300"
                  itemProp="affiliation"
                >
                  {doctor?.hospital || "Mymensingh Medical College & Hospital"}
                </p>
              </div> */}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="gap-2 rounded-full">
                <Link href="#">
                  <Globe className="w-4 h-4" />
                  Website
                </Link>
              </Button>
              {profileButton && (
                <Button
                  asChild
                  className="gap-2 rounded-full bg-blue-600 hover:bg-blue-700"
                >
                  <Link href={`/doctors/${doctor?.id}`}>
                    <Building2 className="w-4 h-4" />
                    View Profile
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
