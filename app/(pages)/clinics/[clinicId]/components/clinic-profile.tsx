import ClinicMembershipCard from "@/app/(pages)/doctors/[doctorId]/components/membarship-card";
import { NotFound } from "@/components/not-found";
import { Rating } from "@/components/ui/rating";
import { getClinicProfileById } from "@/config/clinic/clinic";
import { ClinicWithRelations } from "@/types";
import { Building, Mail, MapPin, Phone, Users } from "lucide-react";
import Image from "next/image";
import ReviewPage from "./review-page";
function StructuredData({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
export default async function ClinicProfile({
  clinicId,
  page,
  limit,
}: {
  clinicId: string;
  page: number;
  limit: number;
}) {
  const result = await getClinicProfileById(clinicId);

  const reviews = result?.reviews?.reviews || [];
  const clinic: ClinicWithRelations | null = result?.clinic || null;
  if (!clinic) {
    return <NotFound title="Subscription expired" />;
  }
  return (
    <div>
      <main className="bg-card/50 backdrop-blur-lg dark:bg-card/70">
        <div className="container py-8">
          {/* Clinic Header */}
          <div className="bg-card/70 rounded-xl border overflow-hidden mb-8">
            <div className="flex flex-col md:flex-row gap-6 p-4">
              {/* Clinic Image */}
              <div className="relative  w-64 h-64      min-w-[128px] rounded-xl border-2 border-white shadow-md overflow-hidden group-hover:scale-105 transition-transform duration-300">
                {clinic?.user?.image ? (
                  <Image
                    src={clinic?.user?.image}
                    alt={`Dr. ${clinic?.user?.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 128px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center  bg-blue-100">
                    <Building className="w-20 h-20 text-primary" />
                  </div>
                )}
              </div>

              {/* Clinic Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-default-900">
                    {clinic?.user?.name}
                  </h1>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <Rating
                      className="gap-x-1 max-w-[100px]"
                      value={clinic?.averageRating || 0}
                    />
                  </div>
                  <span className="text-default-600">
                    {clinic?.averageRating} ({clinic?.reviewsCount} reviews)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg dark:bg-gray-800">
                      <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-default-900">Address</h3>
                      <p className="text-default-600">{clinic?.city}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg dark:bg-gray-800">
                      <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-default-900">Phone</h3>
                      <p className="text-default-600">{clinic?.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg dark:bg-gray-800">
                      <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-default-900">Email</h3>
                      <p className="text-default-600">{clinic?.user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg dark:bg-gray-800">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-default-900">
                        Specialists
                      </h3>
                      <p className="text-default-600">
                        {clinic?.memberships?.length || 0} doctors
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="  gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-card/70 rounded-xl border shadow-md p-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-default-900">
                    Our Doctors{" "}
                    <span className="text-primary-600">
                      ({clinic?.memberships?.length || 0})
                    </span>
                  </h2>
                </div>

                <div className="space-y-6">
                  {clinic?.memberships?.map((doctor) => (
                    <ClinicMembershipCard key={doctor.id} membership={doctor} />
                  ))}
                </div>
              </section>

              {/* About Section */}
              <section className="bg-card/70  rounded-xl shadow-sm p-4">
                <h2 className="text-xl font-bold text-default-900 mb-4">
                  About {clinic?.user?.name}
                </h2>
                <div className="prose max-w-none text-default-700">
                  <p>
                    {clinic?.user?.name} is a premier multi-specialty healthcare
                    facility dedicated to providing exceptional medical care to
                    our community. Our team of{" "}
                    {clinic?.memberships?.length || 0}+ highly skilled
                    physicians and specialists work together to deliver
                    comprehensive, patient-centered care across a wide range of
                    medical disciplines.
                  </p>
                  <p className="mt-4">
                    Founded in 2005, we have grown to become one of the region's
                    most trusted medical centers, known for our cutting-edge
                    technology, compassionate care, and commitment to medical
                    excellence. Our {clinic?.memberships?.length || 0} specialty
                    departments work collaboratively to ensure seamless care for
                    all our patients.
                  </p>
                </div>
              </section>

              {/* Reviews Section */}

              <ReviewPage reviews={reviews} clinicId={clinic?.id} />
            </div>
          </div>
        </div>
      </main>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalClinic", // Correct type for a clinic
          name: clinic?.user?.name,
          url: `${process.env.NEXT_PUBLIC_API_URL}/clinics/${clinic?.id}`,
          image:
            clinic?.user?.image ||
            `${process.env.NEXT_PUBLIC_API_URL}/default-clinic.png`,
          description: `Visit ${clinic?.user?.name} clinic in ${clinic?.city} 
          }. We offer services with our team of ${
            clinic?.memberships?.length || 0
          } specialists.`,
          telephone: clinic?.phoneNumber,
          address: {
            "@type": "PostalAddress",
            addressLocality: clinic?.city || "",
            addressCountry: clinic?.country || "",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: clinic?.averageRating || 0,
            reviewCount: clinic?.reviewsCount || 0,
            bestRating: "5",
            worstRating: "1",
          },

          medicalSpecialty: clinic?.memberships
            ?.map((m) => m.doctor?.specialization)
            .filter(Boolean),

          hasPart: clinic?.memberships?.map((m) => ({
            "@type": "Physician",
            name: `Dr. ${m?.doctor?.user?.name}`,
            url: `${process.env.NEXT_PUBLIC_API_URL}/doctors/${m?.doctor?.id}`,
            medicalSpecialty: m?.doctor?.specialization,
            image:
              m?.doctor?.user?.image ||
              `${process.env.NEXT_PUBLIC_API_URL}/default-doctor.png`,
          })),
        }}
      />
    </div>
  );
}
