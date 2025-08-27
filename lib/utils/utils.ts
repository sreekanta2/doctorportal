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

export const BANGLADESH_DISTRICTS = [
  { value: "", label: "All" },
  { value: "dhaka", label: "Dhaka" },
  { value: "chittagong", label: "Chittagong" },
  { value: "sylhet", label: "Sylhet" },
  { value: "khulna", label: "Khulna" },
  { value: "barishal", label: "Barishal" },
  { value: "rajshahi", label: "Rajshahi" },
  { value: "rangpur", label: "Rangpur" },
  { value: "mymensingh", label: "Mymensingh" },
  { value: "comilla", label: "Comilla" },
  { value: "feni", label: "Feni" },
  { value: "cox's-bazar", label: "Cox's Bazar" },
  { value: "noakhali", label: "Noakhali" },
  { value: "brahmanbaria", label: "Brahmanbaria" },
  { value: "chandpur", label: "Chandpur" },
  { value: "lakshmipur", label: "Lakshmipur" },
  // Add all 64 districts following the same pattern
];

// Type for strict district value checking
export type BangladeshDistrict = (typeof BANGLADESH_DISTRICTS)[number]["value"];

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
