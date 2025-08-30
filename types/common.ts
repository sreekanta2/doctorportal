// types/common.ts
export type UserRole = "patient" | "doctor" | "admin" | "clinic";

export enum NotificationType {
  APPOINTMENT,
  REMINDER,
  SYSTEM,
  BILLING,
  MESSAGE,
}
export enum WeekDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}
export enum PricingPlanStatus {
  FREE,
  BASIC,
  PREMIUM,
}
export enum SubscriptionStatus {
  ACTIVE,
  INACTIVE,
  EXPIRED,
  CANCELED,
}

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};

export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export interface SearchParams {
  search?: string;
  department?: string;
  specialization?: string;
  city?: string;
  country?: string;
  gender?: Gender;
  minRating?: string;
  maxRating?: string;
  minExperience?: string;
  maxExperience?: string;
  minFee?: string;
  maxFee?: string;
  language?: string;
  sortBy?: "rating" | "experience" | "fee" | "name";
  sortOrder?: "asc" | "desc";
  page?: string;
  limit?: string;
}
