import { Hero } from "@/components/hero";
import { getSingleDoctor } from "@/config/doctor/doctors";

import { DoctorWithRelations } from "@/types";
import { PaginationMeta } from "@/types/common";
import { DoctorReview } from "@prisma/client";
import DoctorCard from "../components/search-doctor-card";
import ClinicMembershipCard from "./components/membarship-card";
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
  searchParams,
}: DoctorPageProps) => {
  try {
    const { doctorId } = params;
    const page = Number(searchParams?.page || 1);
    const limit = Number(searchParams?.limit || 2);
    const result = await getSingleDoctor(doctorId, page, limit);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const doctor: DoctorWithRelations = result?.doctor;

    if (!result) {
      return {
        title: "Doctor Not Found | MediBook",
        description: "Doctor profile not found",
      };
    }

    const doctorName = `${doctor?.user?.name}`;
    const specialties = doctor?.specialization || "Specialist";
    const location = doctor?.city || "";
    const canonicalUrl = `${baseUrl}/doctors/${doctorId}`;
    const defaultImage = `${baseUrl}/default-doctor.png`;
    const doctorImage = doctor?.user?.image || defaultImage;

    return {
      title: `${doctorName} - ${specialties} | MediBook`,
      description: `Book appointments with ${doctorName}, ${specialties} in ${location}. Read patient reviews and schedule online.`,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${doctorName} - ${specialties}`,
        description: `Book appointments with ${doctorName} in ${location}.`,
        url: canonicalUrl,
        images: [
          {
            url: doctorImage,
            width: 1200,
            height: 1200,
            alt: `${doctorName} profile photo`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${doctorName} - ${specialties}`,
        description: `Book appointments with ${doctorName} in ${location}`,
        images: [doctorImage],
      },
      keywords: [
        doctorName,
        specialties,
        `${specialties} near me`,
        `doctor ${location}`,
        "book doctor appointment",
      ],
      // JSON-LD structured data for rich snippet
      metadataBase: new URL(baseUrl || ""),
      additionalMetaTags: [
        {
          name: "structured-data",
          content: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Physician",
            "@id": canonicalUrl,
            name: doctorName,
            image: {
              "@type": "ImageObject",
              url: doctorImage,
              width: 1200,
              height: 1200,
            },
            url: canonicalUrl,
            address: {
              "@type": "PostalAddress",
              addressLocality: doctor?.city,
              addressRegion: doctor?.state,
              postalCode: doctor?.zipCode,
              streetAddress: doctor?.street,
            },
            medicalSpecialty: specialties,
            alumniOf: doctor?.hospital || "",
            description: `${doctorName} is a ${specialties} at ${
              doctor?.hospital || "Hospital"
            }`,
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: doctor?.averageRating || 0,
              ratingCount: doctor?.reviewsCount || 0,
              bestRating: 5,
            },
            sameAs: [
              "https://twitter.com/doctor",
              "https://linkedin.com/in/doctor",
            ],
          }),
        },
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

interface DoctorPageProps {
  params: { doctorId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function DoctorPage({
  params,
  searchParams,
}: DoctorPageProps) {
  const page = Number(searchParams?.page || 1);
  const limit = Number(searchParams?.limit || 5);

  const { doctorId } = params;
  const result = await getSingleDoctor(doctorId, page, limit);
  const doctor: DoctorWithRelations = result?.doctor;

  const reviews: DoctorReview[] = result?.reviews?.reviews || [];
  const reviewsPagination: PaginationMeta = result?.reviews?.pagination || {};

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

          <DoctorCard doctor={doctor} />

          {doctor?.memberships?.length > 0 && (
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
                {doctor?.memberships?.length > 0 &&
                  doctor?.memberships?.map((membership) => {
                    return (
                      <ClinicMembershipCard
                        key={membership?.id}
                        membership={membership}
                      />
                    );
                  })}
              </div>
            </section>
          )}

          <section aria-labelledby="reviews-heading">
            <ReviewPage
              reviews={reviews}
              pagination={reviewsPagination}
              doctorId={doctorId}
            />
          </section>
        </div>
      </main>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Physician",
          name: doctor?.user?.name,
          url: `${process.env.NEXT_PUBLIC_API_URL}/doctors/${doctor?.id}`,
          image:
            doctor?.user?.image ||
            `${process.env.NEXT_PUBLIC_API_URL}/default-doctor.png`,
          medicalSpecialty: doctor?.specialization || "General Practice",
          hospitalAffiliation: doctor?.hospital || "",
          address: {
            "@type": "PostalAddress",
            streetAddress: doctor?.street || "",
            addressLocality: doctor?.city || "",
            addressRegion: doctor?.state || "",
            addressCountry: doctor?.country || "",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: doctor?.averageRating || 0,
            reviewCount: doctor?.reviewsCount || 0,
            bestRating: "5",
          },
        }}
      />
    </div>
  );
}
