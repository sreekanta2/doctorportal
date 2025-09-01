import { NotFound } from "@/components/not-found";
import { getSingleDoctor } from "@/config/doctor/doctors";
import { DoctorWithRelations } from "@/types";
import { PaginationMeta } from "@/types/common";
import { DoctorReview } from "@prisma/client";
import DoctorCard from "../../components/search-doctor-card";
import ClinicMembershipCard from "./membarship-card";
import ReviewPage from "./review-page";
function StructuredData({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function DoctorProfile({
  doctorId,
  page,
  limit,
}: {
  doctorId: string;
  page: number;
  limit: number;
}) {
  const result = await getSingleDoctor(doctorId, page, limit);

  if (!result?.doctor) {
    return (
      <NotFound title="Doctor not found" description="Try searching again" />
    );
  }

  const doctor: DoctorWithRelations = result.doctor;
  const reviews: DoctorReview[] = result.reviews?.reviews || [];
  const reviewsPagination: PaginationMeta = result.reviews?.pagination || {};

  return (
    <div className="space-y-8">
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
            {doctor.memberships.map((membership) => (
              <ClinicMembershipCard
                key={membership.id}
                membership={membership}
              />
            ))}
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
            addressLocality: doctor?.city || "",
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
