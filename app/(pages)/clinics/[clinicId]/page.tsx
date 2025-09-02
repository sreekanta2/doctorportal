import { Hero } from "@/components/hero";

import { getClinicProfileById } from "@/config/clinic/clinic";
import { ClinicWithRelations } from "@/types";
import { Suspense } from "react";
import DoctorCardSkeleton from "../../doctors/components/doctor-card-skeleton";
import ClinicProfile from "./components/clinic-profile";

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

export default async function ClinicPage({
  params,
  searchParams,
}: {
  params: { clinicId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const limit = Number(searchParams?.limit || 5);
  const { clinicId } = params;

  const page = Number(searchParams?.page || 1);

  return (
    <div className="bg-background">
      <Hero
        title={<span className="text-primary">Clinic Profile</span>}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Clinics", href: "/clinics" },
          { label: clinicId },
        ]}
      />

      <Suspense
        fallback={
          <div className="grid gap-4 my-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <DoctorCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <ClinicProfile clinicId={clinicId} page={page} limit={limit} />
      </Suspense>
    </div>
  );
}
