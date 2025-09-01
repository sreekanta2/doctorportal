import { z } from "zod";

export const baseClinicSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["clinic", "doctor", "patient", "admin"]).default("clinic"),
  image: z.string().optional(),
  website: z.string().optional(),
  phoneNumber: z.string().min(11, "Phone number must be 11"),
  description: z.string().optional(),
  openingHour: z.string().min(2, "This is required"),
  establishedYear: z.coerce
    .number()
    .int("Year must be an integer")
    .min(1900, "Year must be realistic")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
});

export const createClinicSchema = baseClinicSchema;

export const updateClinicSchema = baseClinicSchema.partial().extend({
  email: z.string().email("Invalid email"),
});

export type CreateClinicInput = z.infer<typeof createClinicSchema>;
export type UpdateClinicInput = z.infer<typeof updateClinicSchema>;
