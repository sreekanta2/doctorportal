import { z } from "zod";

export const AppointmentStatus = z.enum([
  "SCHEDULED",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
]);
// zod-validation/enum.ts

export const WeekDaySchema = z.enum([
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]);
export const SubscriptionStatus = z.enum([
  "ACTIVE",
  "INACTIVE",
  "EXPIRED",
  "CANCELED",
]);
export const UserRole = z.enum(["admin", "doctor", "clinic", "patient"]);
export type WeekDayType = z.infer<typeof WeekDaySchema>;

export const Gender = z.enum(["MALE", "FEMALE", "OTHER"]);
