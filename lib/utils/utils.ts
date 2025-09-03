export const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
};

export const UserRole = {
  PATIENT: "patient",
  DOCTOR: "doctor",
  ADMIN: "admin",
  CLINIC: "clinic",
};

type Specialization = {
  id: string;
  name: string;
  totalDoctors: number;
};

type SelectOption = {
  value: string;
  label: string;
  totalDoctors: number;
};

export function mapSpecializationsToOptions(
  specializations: Specialization[]
): SelectOption[] {
  return specializations.map((spec) => ({
    value: spec.name.toLowerCase().replace(/\s+/g, "_"), // convert to lowercase with underscores
    label: spec.name,
    totalDoctors: spec.totalDoctors,
  }));
}
