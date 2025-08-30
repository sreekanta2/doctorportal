import {
  Clinic,
  ClinicMembership,
  Doctor,
  DoctorReview,
  MedicalHistory,
  Prisma,
  Schedule,
  User,
} from "@prisma/client";

export interface DoctorPageProps {
  params: { doctorId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export type UserWithDoctor = User & {
  doctor: Doctor;
};
export type ClinicWithUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  clinic: {
    id: string;
    phoneNumber: string;
    description: string | null;
    openingHour: string | null;
    establishedYear: number | null;
    street: string | null;
    city: string | null;
    country: string | null;
    zipCode: string | null;
  } | null;
};

export type DoctorWithRelations = Prisma.DoctorGetPayload<{
  include: {
    user: true;
    reviews: true;
    memberships: {
      include: {
        clinic: {
          include: {
            user: true;
          };
        };
        schedules: true;
      };
    };
    medicalHistory: true;
  };
}>;
export type ClinicWithRelations = Prisma.ClinicGetPayload<{
  include: {
    user: true;
    memberships: {
      include: {
        doctor: {
          include: {
            user: true;
          };
        };
        schedules: true;
      };
    };
  };
}>;
export type PatientWithRelations = Prisma.PatientGetPayload<{
  include: {
    user: true;
  };
}>;
export type MembershipWithRelations = ClinicMembership & {
  doctor?: Doctor & {
    user: Pick<User, "name" | "email" | "image">;
  };
  clinic?: Clinic & {
    user: Pick<User, "name" | "email" | "image">;
  };
  schedules: Schedule[];
};

export type MedicalHistoryWithRelations = MedicalHistory & {
  doctor: Doctor & {
    user: Pick<User, "name" | "email" | "image">;
  };

  medicalHistory: MedicalHistory[];
};
export interface ReviewWithUser extends DoctorReview {
  reviewer?: User;
  doctor?: Doctor & {
    user: Pick<User, "name" | "email" | "image">;
  };
}
export type DoctorReviewWithRelations = Prisma.DoctorReviewGetPayload<{
  include: {
    reviewer?: true;
  };
}>;

export type SubscriptionWithRelations = Prisma.SubscriptionGetPayload<{
  include: {
    clinic: {
      include: {
        user: true; // ✅ include clinic owner user
      };
    };
    pricePlan: true; // ✅ include pricing plan
  };
}>;
