import {
  Clinic,
  ClinicMembership,
  Doctor,
  MedicalHistory,
  Prisma,
  Schedule,
  User,
} from "@prisma/client";

export type DoctorWithRelations = Prisma.DoctorGetPayload<{
  include: {
    user: true;
    reviews: true;
    memberships: true;
    medicalHistory: true;
  };
}>;
export type ClinicWithRelations = Prisma.ClinicGetPayload<{
  include: {
    user: true;
  };
}>;
export type PatientWithRelations = Prisma.PatientGetPayload<{
  include: {
    user: true;
  };
}>;

export type MembershipWithRelations = ClinicMembership & {
  doctor: Doctor & {
    user: Pick<User, "name" | "email">;
  };
  clinic: Clinic & {
    user: Pick<User, "name" | "email">;
  };
  schedules: Schedule[];
};
export type MedicalHistoryWithRelations = MedicalHistory & {
  doctor: Doctor & {
    user: Pick<User, "name" | "email" | "image">;
  };

  medicalHistory: MedicalHistory[];
};
