import { Hero } from "@/components/hero";
import { getDoctorSEO } from "@/config/doctor/doctors";
import { DoctorPageProps } from "@/types";
import { Suspense } from "react";
import DoctorCardSkeleton from "../components/doctor-card-skeleton";
import DoctorProfile from "./components/doctor-profile";

export const generateMetadata = async ({ params }: DoctorPageProps) => {
  try {
    const { doctorId } = params;
    const doctor = await getDoctorSEO(doctorId);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!doctor) {
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
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Doctor Profile | MediBook",
      description: "Book appointments with qualified doctors",
    };
  }
};

export default function DoctorPage({
  params,
  searchParams,
}: {
  params: { doctorId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams?.page || 1);
  const limit = Number(searchParams?.limit || 5);
  const { doctorId } = params;

  return (
    <div className="bg-background">
      <Hero
        title={<span className="text-primary">Doctor Profile</span>}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Doctors", href: "/doctors" },
          { label: doctorId },
        ]}
      />

      <main className="bg-card/50 backdrop-blur-lg shadow-md dark:bg-card/70">
        <div className="container py-4">
          {/* ✅ Streaming profile */}
          <Suspense
            fallback={
              <div className="grid gap-4 my-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <DoctorCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <DoctorProfile doctorId={doctorId} page={page} limit={limit} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
