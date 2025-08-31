import { Hero } from "@/components/hero";
import { Mail, MapPin, Phone, Users } from "lucide-react";

import { Rating } from "@/components/ui/rating";

import { Building } from "@/components/svg";
import { getClinicProfileById } from "@/config/clinic/clinic";
import { ClinicWithRelations } from "@/types";
import Image from "next/image";
import Link from "next/link";
import ClinicMembershipCard from "../../doctors/[doctorId]/components/membarship-card";
import ReviewPage from "./components/review-page";
function StructuredData({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: { clinicId: string };
}) {
  const result = await getClinicProfileById(params.clinicId);
  const clinic: ClinicWithRelations | null = result?.clinic || null;

  if (!clinic) {
    return {
      title: "Clinic Not Found | [Your Site Name]",
      description:
        "The requested clinic does not exist. Browse our list of medical clinics and hospitals to find the right care for you.",
    };
  }

  const title = `${clinic.user.name} - ${clinic.city} | Book an Appointment`;
  const description = `Visit ${clinic.user.name} in ${
    clinic.city
  }. We offer comprehensive care with our team of ${
    clinic.memberships?.length || 0
  } specialists. Read patient reviews, get directions, and contact us to schedule your visit today.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_API_URL}/clinics/${clinic.id}`,
      images: clinic.user.image ? [{ url: clinic.user.image }] : [],
    },
    // Add canonical link to prevent duplicate content issues
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_API_URL}/clinics/${clinic.id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Structured Data (JSON-LD)

export default async function ClinicPage({
  params,
}: {
  params: { clinicId: string };
}) {
  const { clinicId } = params;
  const result = await getClinicProfileById(clinicId);
  const clinic: ClinicWithRelations | null = result?.clinic || null;

  const reviews = result?.reviews?.reviews || [];

  if (!clinic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Clinic not found</h1>
          <p className="mt-2 text-default-600">
            The clinic you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/clinics"
            className="mt-4 inline-block text-primary-600 hover:underline"
          >
            Browse all clinics
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-background">
      <Hero
        title={<span className="text-primary">{clinic?.user?.name}</span>}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Clinics", href: "/clinics" },
          { label: clinic?.user?.name },
        ]}
      />

      <main className="bg-card/50 backdrop-blur-lg dark:bg-card/70">
        <div className="container py-8">
          {/* Clinic Header */}
          <div className="bg-card/70 rounded-xl shadow-md overflow-hidden mb-8">
            <div className="flex flex-col md:flex-row gap-6 p-6">
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
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700">
                    <Building className="w-20 h-20 text-gray-400 dark:text-gray-500" />
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
                      <p className="text-default-600">{clinic?.street}</p>
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

                {/* <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild variant="outline">
                    <a href={`tel:${clinic?.phoneNumber}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call Clinic
                    </a>
                  </Button>
                  <Button asChild variant="ghost">
                    <a
                      href={`https://maps.google.com?q=${encodeURIComponent(
                        clinic?.street || ""
                      )}`}
                      target="_blank"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Get Directions
                    </a>
                  </Button>
                </div> */}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="  gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Doctors Section */}
              <section className="bg-card/70 rounded-xl shadow-sm p-4">
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
                  {/* <p className="mt-4">
                    Our state-of-the-art facility includes{" "}
                    {clinic?.facilities?.length || 0} specialized departments and
                    services designed to meet all of your healthcare needs in
                    one convenient location.
                  </p> */}
                </div>
              </section>

              {/* Reviews Section */}

              <ReviewPage reviews={reviews} clinicId={clinic?.id} />

              {/* Add Review Section */}
            </div>

            {/* Right Column - Sidebar */}
            {/* <div className="space-y-6">
              
              <section className="bg-card/70 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-default-900 mb-4">
                  Medical Specialties
                </h2>
                <div className="flex flex-wrap gap-3">
                  {clinic?.specialties?.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 rounded-full bg-card text-primary-700 text-sm font-medium shadow-md"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </section>

              <ClinicMap address={"Eye Hospital Rd, Dinajpur"} />
            </div> */}
          </div>
        </div>
      </main>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalClinic", // Correct type for a clinic
          name: clinic.user?.name,
          url: `${process.env.NEXT_PUBLIC_API_URL}/clinics/${clinic.id}`,
          image:
            clinic.user?.image ||
            `${process.env.NEXT_PUBLIC_API_URL}/default-clinic.png`,
          description: `Visit ${clinic.user?.name} clinic in ${clinic.city}, ${
            clinic.state
          }. We offer services with our team of ${
            clinic.memberships?.length || 0
          } specialists.`,
          telephone: clinic.phoneNumber,
          address: {
            "@type": "PostalAddress",
            streetAddress: clinic.street || "",
            addressLocality: clinic.city || "",
            addressRegion: clinic.state || "",
            addressCountry: clinic.country || "",
            postalCode: clinic.zipCode || "",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: clinic.averageRating || 0,
            reviewCount: clinic.reviewsCount || 0,
            bestRating: "5",
            worstRating: "1",
          },

          medicalSpecialty: clinic.memberships
            ?.map((m) => m.doctor?.specialization)
            .filter(Boolean),

          hasPart: clinic.memberships?.map((m) => ({
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
