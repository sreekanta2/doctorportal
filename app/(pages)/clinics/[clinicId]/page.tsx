import { Hero } from "@/components/hero";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Star, User, Users } from "lucide-react";

import Pagination from "@/components/PaginationComponents";
import { CheckMark } from "@/components/svg";
import { Rating } from "@/components/ui/rating";

import { getClinic } from "@/config/clinic";
import { avatar } from "@/config/site";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ClinicMap from "./components/clinic-map";
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

// Generate dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: { clinicId: string };
}): Promise<Metadata> {
  const clinic = await getClinic(1, 10);
  const clinicName = clinic?.data?.name || "Premium Medical Clinic";
  const specialties =
    clinic?.data?.specialties?.join(", ") || "Multi-specialty clinic";

  return {
    title: `${clinicName} - ${specialties} | MediBook`,
    description: `${clinicName} offers comprehensive healthcare services with multiple specialists. Book appointments online.`,
    alternates: {
      canonical: `https://yourdomain.com/clinics/${params.clinicId}`,
    },
    openGraph: {
      title: `${clinicName} - ${specialties}`,
      description: `Book appointments at ${clinicName} with multiple specialists. ${
        clinic?.data?.description?.substring(0, 100) || ""
      }`,
      url: `https://yourdomain.com/clinics/${params.clinicId}`,
      images: clinic?.data?.image
        ? [
            {
              url: clinic.data.image,
              width: 800,
              height: 600,
              alt: `${clinicName} clinic`,
            },
          ]
        : [
            {
              url: "https://yourdomain.com/default-clinic.jpg",
              width: 800,
              height: 600,
              alt: "Medical clinic",
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${clinicName} - ${specialties}`,
      description: `Book appointments at ${clinicName} with multiple specialists`,
      images: clinic?.data?.image
        ? [clinic.data.image]
        : ["https://yourdomain.com/default-clinic.jpg"],
    },
    keywords: [
      clinicName,
      "medical clinic",
      "multi-specialty clinic",
      "doctor appointments",
      "healthcare services",
      ...(clinic?.data?.specialties || []),
    ],
  };
}

export default async function ClinicPage({
  params,
}: {
  params: { clinicId: string };
}) {
  const { clinicId } = params;
  const clinic = await getClinic(1, 2);

  if (!clinic?.data) {
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

  const clinicData = {
    ...clinic.data,
    id: clinicId,
    name: clinic.data.name || "Premium Medical Clinic",
    image: clinic.data.image || "/default-clinic.jpg",
    description:
      clinic.data.description ||
      "A state-of-the-art medical facility providing comprehensive healthcare services.",
    address: clinic.data.address || "123 Medical Center Drive, Health District",
    phone: clinic.data.phone || "+1 (555) 123-4567",
    email: clinic.data.email || "info@clinic.com",
    website: clinic.data.website || "https://clinic.com",
    premium: clinic.data.premium || true,
    specialties: clinic.data.specialties || [
      "Cardiology",
      "Orthopedics",
      "Neurology",
    ],
    rating: clinic.data.rating || 4.8,
    reviewCount: clinic.data.reviewCount || 124,
    hours: clinic.data.hours || {
      monday: { open: "8:00 AM", close: "8:00 PM" },
      tuesday: { open: "8:00 AM", close: "8:00 PM" },
      wednesday: { open: "8:00 AM", close: "8:00 PM" },
      thursday: { open: "8:00 AM", close: "8:00 PM" },
      friday: { open: "8:00 AM", close: "6:00 PM" },
      saturday: { open: "9:00 AM", close: "3:00 PM" },
      sunday: { open: "Closed", close: "Closed" },
    },
    facilities: clinic.data.facilities || [
      "Emergency Services",
      "Diagnostic Imaging",
      "Pharmacy",
      "Physical Therapy",
      "Free Parking",
    ],
    doctorCount: clinic.data.doctorCount || 28,
    doctors: clinic.data.doctors || [
      {
        id: "doc-101",
        name: "Dr. Sarah Johnson",
        image: "/images/doctors/sarah-johnson.jpg",
        specialty: "Cardiology",
        rating: 4.9,
        reviewCount: 68,
        education: "MD, Harvard Medical School",
        languages: ["English", "Spanish"],
        availableToday: true,
        schedule: [
          {
            formDate: "Satarday",
            toDay: "Friday",
            startTime: "8.00",
            endTime: "12.00",
          },
        ],
      },
      {
        id: "doc-102",
        name: "Dr. Michael Chen",
        image: "/images/doctors/michael-chen.jpg",
        specialty: "Orthopedic Surgery",
        rating: 4.8,
        reviewCount: 42,
        education: "MD, Johns Hopkins University",
        languages: ["English", "Mandarin"],
        availableToday: false,
        schedule: [
          {
            formDate: "Satarday",
            toDay: "Friday",
            startTime: "8.00",
            endTime: "12.00",
          },
        ],
      },
      {
        id: "doc-103",
        name: "Dr. Priya Patel",
        image: "/images/doctors/priya-patel.jpg",
        specialty: "Neurology",
        rating: 4.7,
        reviewCount: 35,
        education: "MD, Stanford University",
        languages: ["English", "Hindi"],
        availableToday: true,
        schedule: [
          {
            formDate: "Satarday",
            toDay: "Friday",
            startTime: "8.00",
            endTime: "12.00",
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-background">
      <Hero
        title={<span className="text-primary">{clinicData.name}</span>}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Clinics", href: "/clinics" },
          { label: clinicData.name },
        ]}
      />

      <main className="bg-card/50 backdrop-blur-lg dark:bg-card/70">
        <div className="container py-8">
          {/* Clinic Header */}
          <div className="bg-card/70 rounded-xl shadow-md overflow-hidden mb-8">
            <div className="flex flex-col md:flex-row gap-6 p-6">
              {/* Clinic Image */}
              <div className="w-full md:w-1/3 lg:w-1/4">
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={clinicData.image}
                    alt={clinicData.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  {clinicData.premium && (
                    <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-white" />
                      PREMIUM
                    </div>
                  )}
                </div>
              </div>

              {/* Clinic Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-default-900">
                    {clinicData.name}
                  </h1>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <Rating className="gap-x-1 max-w-[100px]" value={4} />
                  </div>
                  <span className="text-default-600">
                    {clinicData.rating} ({clinicData.reviewCount} reviews)
                  </span>
                </div>

                <p className="text-default-700 mb-6">
                  {clinicData.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-default-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-default-900">Address</h3>
                      <p className="text-default-600">{clinicData.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-default-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-default-900">Phone</h3>
                      <p className="text-default-600">{clinicData.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-default-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-default-900">Email</h3>
                      <p className="text-default-600">{clinicData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-default-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-default-900">
                        Specialists
                      </h3>
                      <p className="text-default-600">
                        {clinicData.doctorCount}+ doctors
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild variant="outline">
                    <a href={`tel:${clinicData.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call Clinic
                    </a>
                  </Button>
                  <Button asChild variant="ghost">
                    <a
                      href={`https://maps.google.com?q=${encodeURIComponent(
                        clinicData.address
                      )}`}
                      target="_blank"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Get Directions
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Doctors Section */}
              <section className="bg-card/70 rounded-xl shadow-sm p-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-default-900">
                    Our Doctors{" "}
                    <span className="text-primary-600">
                      ({clinicData.doctorCount})
                    </span>
                  </h2>
                </div>

                <div className="space-y-6">
                  {clinicData.doctors.map((doctor) => {
                    return (
                      <article
                        key={doctor.id}
                        className="border bg-card rounded-md shadow-md overflow-hidden"
                        itemScope
                        itemType="https://schema.org/Physician"
                      >
                        <meta
                          itemProp="@id"
                          content={`https://yourdomain.com/doctors/${doctor.id}`}
                        />
                        <meta
                          itemProp="medicalSpecialty"
                          content={doctor.specialty || "General Practice"}
                        />

                        <div className="w-full grid grid-cols-1 lg:grid-cols-4">
                          <div className="w-full col-span-4 flex flex-col sm:flex-row gap-4 p-4">
                            <figure className="relative h-[120px] w-[120px] min-w-[120px] aspect-square">
                              {doctor?.image ? (
                                <Image
                                  src={doctor?.image || avatar}
                                  alt={`Dr. ${doctor?.name || ""}, ${
                                    doctor.specialty || "Doctor"
                                  }`}
                                  fill
                                  className="rounded-lg object-cover"
                                  itemProp="image"
                                  sizes="(max-width: 768px) 100vw, 120px"
                                />
                              ) : (
                                <div className="w-full h-full p-2 rounded-md border flex items-center justify-center bg-default-70">
                                  <User className="w-1/2 h-1/2 text-default-700" />
                                </div>
                              )}
                            </figure>

                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h2
                                  className="text-xl sm:text-2xl font-medium"
                                  itemProp="name"
                                >
                                  <Link
                                    href={`/doctors/${doctor.id}`}
                                    itemProp="url"
                                    className="hover:underline"
                                  >
                                    {doctor?.name || ""}
                                  </Link>
                                </h2>
                                <span
                                  className="w-5 h-5 text-blue-500 flex-shrink-0"
                                  aria-label="Verified doctor"
                                >
                                  <CheckMark />
                                </span>
                              </div>

                              <p
                                className="text-sm sm:text-base text-default-700"
                                itemProp="description"
                              >
                                {doctor.specialty ||
                                  "MBBS, BCS (Health), MS (Ortho)"}
                              </p>

                              <h3
                                className="text-lg font-medium text-primary-600"
                                itemProp="affiliation"
                              >
                                {"Mymensingh Medical College & Hospital"}
                              </h3>

                              <div className="bg- p-4 rounded-xl shadow-md space-y-3">
                                <ul className="space-y-2 list-disc list-inside text-sm text-default-700">
                                  {doctor?.schedule?.length > 0 ? (
                                    doctor.schedule.map((s, i) => (
                                      <li key={i} className="pl-1">
                                        <span className="font-medium text-blue-600">
                                          {s.formDate}
                                        </span>{" "}
                                        to
                                        <span className="font-medium text-blue-600">
                                          {" "}
                                          {s.toDate}
                                        </span>{" "}
                                        :
                                        <span className="text-purple-600 font-medium">
                                          {" "}
                                          {s.formTime}
                                        </span>{" "}
                                        -
                                        <span className="text-purple-600 font-medium">
                                          {" "}
                                          {s.toTime}
                                        </span>
                                      </li>
                                    ))
                                  ) : (
                                    <li className="text-gray-500">
                                      No schedule available
                                    </li>
                                  )}
                                </ul>
                              </div>

                              <div className="pt-2 flex gap-2 sm:gap-8 items-center">
                                <Button
                                  asChild
                                  variant="outline"
                                  color="primary"
                                  size="sm"
                                  className="w-fit"
                                >
                                  <Link
                                    href={`https://google.com`}
                                    target="_blank"
                                    aria-label="Visit doctor's website"
                                  >
                                    Website
                                  </Link>
                                </Button>
                                <Button
                                  asChild
                                  variant="outline"
                                  color="primary"
                                  size="sm"
                                  className="w-fit"
                                >
                                  <Link
                                    href={`/clinics/${1}/booking`}
                                    aria-label="View doctor's chambers"
                                  >
                                    Booking
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="mt-8 text-center">
                  <Pagination totalPages={5} currentPage={1} />
                </div>
              </section>

              {/* About Section */}
              <section className="bg-card/70  rounded-xl shadow-sm p-4">
                <h2 className="text-xl font-bold text-default-900 mb-4">
                  About {clinicData.name}
                </h2>
                <div className="prose max-w-none text-default-700">
                  <p>
                    {clinicData.name} is a premier multi-specialty healthcare
                    facility dedicated to providing exceptional medical care to
                    our community. Our team of {clinicData.doctorCount}+ highly
                    skilled physicians and specialists work together to deliver
                    comprehensive, patient-centered care across a wide range of
                    medical disciplines.
                  </p>
                  <p className="mt-4">
                    Founded in 2005, we have grown to become one of the region's
                    most trusted medical centers, known for our cutting-edge
                    technology, compassionate care, and commitment to medical
                    excellence. Our {clinicData.specialties.length} specialty
                    departments work collaboratively to ensure seamless care for
                    all our patients.
                  </p>
                  <p className="mt-4">
                    Our state-of-the-art facility includes{" "}
                    {clinicData.facilities.length} specialized departments and
                    services designed to meet all of your healthcare needs in
                    one convenient location.
                  </p>
                </div>
              </section>

              {/* Reviews Section */}

              <ReviewPage reviews={clinicData.reviews} />

              {/* Add Review Section */}

              <ReviewForm doctorId={clinicData.id} />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Appointment Form */}
              {/* Specialties Section */}
              <section className="bg-card/70 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-default-900 mb-4">
                  Medical Specialties
                </h2>
                <div className="flex flex-wrap gap-3">
                  {clinicData.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 rounded-full bg-card text-primary-700 text-sm font-medium shadow-md"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </section>

              <ClinicMap address="dinajpur" />
            </div>
          </div>
        </div>
      </main>

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalClinic",
          "@id": `https://yourdomain.com/clinics/${clinicId}`,
          name: clinicData.name,
          image: clinicData.image,
          url: `https://yourdomain.com/clinics/${clinicId}`,
          telephone: clinicData.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: clinicData.address,
          },
          medicalSpecialty: clinicData.specialties.join(", "),
          description: clinicData.description,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: clinicData.rating,
            ratingCount: clinicData.reviewCount,
            bestRating: "5",
          },
          openingHoursSpecification: Object.entries(clinicData.hours).map(
            ([day, hours]) => ({
              "@type": "OpeningHoursSpecification",
              dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
              opens: hours.open,
              closes: hours.close,
            })
          ),
          sameAs: clinicData.website ? [clinicData.website] : [],
        }}
      />

      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://yourdomain.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Clinics",
              item: "https://yourdomain.com/clinics",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: clinicData.name,
              item: `https://yourdomain.com/clinics/${clinicId}`,
            },
          ],
        }}
      />
    </div>
  );
}
