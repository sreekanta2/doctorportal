import { Hero } from "@/components/hero";
import { User } from "@/components/svg";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { getSingleDoctor } from "@/config/doctor/doctors";

import { DoctorWithRelations, MembershipWithRelations } from "@/types";
import {
  BadgeCheck,
  Bookmark,
  Building2,
  Calendar,
  CalendarDays,
  Clock,
  FileText,
  Globe,
  GraduationCap,
  MapPin,
  Stethoscope,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReviewForm from "./components/review-form";
import ReviewPage from "./components/review-page";

// Structured Data Component
function StructuredData({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const generateMetadata = async ({
  params,
}: {
  params: { doctorId: string };
}): Promise<Metadata> => {
  try {
    const { doctorId } = params;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const result = await getSingleDoctor(doctorId);

    const doctor: DoctorWithRelations = result?.doctor;

    if (!result?.success) {
      return {
        title: "Doctor Not Found | MediBook",
        description: "Doctor profile not found",
      };
    }

    const doctorName = `${doctor?.user?.name}`;
    const specialties = doctor?.specialization || "Specialist";
    const location = doctor?.city || "";

    const canonicalUrl = `${baseUrl}/doctors/${params?.doctorId}`;
    const defaultImage = doctor?.user?.image || `${baseUrl}/default-doctor.png`;

    return {
      title: `${doctorName} - ${specialties} | MediBook`,
      description: `Book appointments with ${doctorName}, ${specialties} in ${location}. Read patient reviews and schedule online.`,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${doctorName} - ${specialties}`,
        description: `Book appointments with ${doctorName} in ${location}. ${""}`,
        url: canonicalUrl,
        images: [
          {
            url: doctor?.user?.image || defaultImage,
            width: 300,
            height: 300,
            alt: `${doctorName} profile photo`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${doctorName} - ${specialties}`,
        description: `Book appointments with ${doctorName} in ${location}`,
        images: [doctor?.user?.image || defaultImage],
      },
      keywords: [
        doctorName,
        specialties,
        `${specialties} near me`,
        `doctor ${location}`,
        "book doctor appointment",
      ],
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Doctor Profile | MediBook",
      description: "Book appointments with qualified doctors",
    };
  }
};
export default async function DoctorPage({
  params,
}: {
  params: { doctorId: string };
}) {
  const { doctorId } = params;
  const result = await getSingleDoctor(doctorId);

  const doctor: DoctorWithRelations = result?.doctor;
  const reviews: DoctorWithRelations = result?.reviews;
  const memberships: MembershipWithRelations[] = result?.doctor?.memberships;

  const doctorName = ` ${doctor?.user?.name}  `;
  const specialties = doctor?.specialization;
  const hospital = doctor?.hospital;

  return (
    <div className="bg-background">
      <Hero
        title={<span className="text-primary">Search Doctor</span>}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Doctors", href: "/doctors" },
          { label: doctor?.user?.name || "" },
        ]}
      />

      <main className="bg-card/50 backdrop-blur-lg shadow-md dark:bg-card/70">
        <div className="container space-y-8 py-4">
          {/* Doctor Profile Section */}
          <article
            key={doctor?.id}
            className="border bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md dark:bg-gray-900 dark:border-gray-800"
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
                        ${doctor?.user?.name}
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
                      {doctor?.specialization ||
                        "MBBS, BCS (Health), MS (Ortho)"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <p
                      className="text-gray-700 dark:text-gray-300"
                      itemProp="affiliation"
                    >
                      {doctor?.hospital ||
                        "Mymensingh Medical College & Hospital"}
                    </p>
                  </div>

                  {/* {doctor?.languages && (
                    <div className="flex items-center gap-2 pt-1">
                      <Languages className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {doctor?.languages}
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
                      <Link href={`/doctors/${doctor?.id}/booking`}>
                        <Building2 className="w-4 h-4" />
                        Booking
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
                      value={doctor?.averageRating || 4}
                      readOnly
                      className="gap-x-1 max-w-[110px]"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Reviews ({doctor?.reviewsCount || 0})
                    </span>
                  </div>

                  {/* {doctor?.experience && (
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {doctor?.experience}+ years
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

          {memberships?.length > 0 && (
            <section aria-labelledby="clinics-heading">
              <header className="mb-4">
                <h1
                  id="clinics-heading"
                  className="font-semibold text-xl text-default-800"
                >
                  Chambers & Clinics
                </h1>
              </header>

              <div className="grid gap-10">
                {memberships?.length > 0 &&
                  memberships?.map((membership) => (
                    <article
                      key={membership?.id}
                      className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all hover:shadow-xl group"
                    >
                      {/* Discount Badge */}
                      <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                        Save 30% Instantly
                      </div>

                      <div className="p-6 sm:p-8">
                        <div className="flex flex-col lg:flex-row gap-10">
                          {/* Left Info Section */}
                          <div className="flex-1 space-y-6">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                membership?.clinic?.name
                              </h2>
                              <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-3 py-1 rounded-full font-medium">
                                Available Today
                              </div>
                            </div>

                            {/* Offer Highlight */}
                            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                                    Exclusive Diagnostic Discount
                                  </h3>
                                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                    Book online and receive{" "}
                                    <strong>30% off</strong> on all diagnostic
                                    reports including lab tests and imaging.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Location & Timing */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300 text-sm">
                              <div className="flex items-start gap-2">
                                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                {membership?.clinic?.street}
                              </div>
                              {membership?.clinic?.phoneNumber && (
                                <div className="flex items-center gap-2">
                                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                  {membership?.clinic?.openingHour}
                                </div>
                              )}
                            </div>

                            {/* Schedule */}
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                Available Slots
                              </h4>
                              <div className="flex gap-3">
                                {membership?.schedules?.map((schedule) => (
                                  <div
                                    key={schedule?.id}
                                    className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg text-sm hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition"
                                  >
                                    <div className="flex items-center gap-2 min-w-[120px]">
                                      <CalendarDays className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                      <span>
                                        {schedule?.startDay} -{" "}
                                        {schedule?.endDay}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                      <span>
                                        {schedule?.startTime} -{" "}
                                        {schedule?.endTime}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Right CTA Section */}
                          <div className="lg:w-72 flex flex-col justify-between">
                            {/* Steps */}
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 mb-6 space-y-4">
                              <h3 className="text-base font-semibold text-gray-800 dark:text-white">
                                How to Save
                              </h3>
                              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                                {[
                                  "Book your appointment through our website.",
                                  "Complete your consultation.",
                                  "Get 30% off on your diagnostic reports.",
                                ].map((step, index) => (
                                  <li
                                    key={index}
                                    className="flex gap-3 items-start"
                                  >
                                    <span className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">
                                      {index + 1}
                                    </span>
                                    <span className="flex-1 text-sm text-gray-600 dark:text-gray-300">
                                      {step}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* CTA */}
                            <div className="space-y-3">
                              <Link
                                href={`/doctors/${doctor?.id}/booking`}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 font-semibold transition shadow hover:shadow-lg"
                              >
                                <Calendar className="w-5 h-5" />
                                Book Now & Save 30%
                              </Link>
                              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                                Discount applied automatically when booking
                                online.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            </section>
          )}
          <section aria-labelledby="reviews-heading">
            <ReviewPage reviews={doctor?.reviews} />
          </section>

          <section aria-labelledby="add-review-heading">
            <h2
              id="add-review-heading"
              className="font-semibold text-xl text-default-800 mb-4"
            >
              Share Your Experience
            </h2>
            <ReviewForm doctorId={doctor?.id} />
          </section>
        </div>
      </main>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Physician",
          "@id": `${process.env.NEXT_PUBLIC_API_URL}/doctors/${doctorId}`,
          name: doctorName,
          image:
            doctor?.user?.image ||
            `${process.env.NEXT_PUBLIC_API_URL}/default-doctor.png`,
          url: `${process.env.NEXT_PUBLIC_API_URL}/doctors/${doctorId}`,
          address: {
            "@type": "PostalAddress",
            addressLocality: doctor?.city,
            addressRegion: doctor?.state,
            postalCode: doctor?.zipCode,
            streetAddress: doctor?.street,
          },
          medicalSpecialty: specialties,
          alumniOf: hospital,
          description: `${doctorName} is a ${specialties} at ${hospital}`,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: doctor?.averageRating || 0,
            ratingCount: doctor?.reviewsCount || 0,
            bestRating: "5",
          },
          sameAs: [
            "https://twitter.com/doctor",
            "https://linkedin.com/in/doctor",
          ],
        }}
      />
    </div>
  );
}
