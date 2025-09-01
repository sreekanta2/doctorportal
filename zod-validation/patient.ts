import { z } from "zod";
import { Gender } from "./enum";

export const PatientBaseSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["clinic", "doctor", "patient", "admin"]).default("clinic"),
  image: z.string().optional(),

  phoneNumber: z.string().min(11, "Phone number is too short"),
  age: z.coerce
    .number()
    .int("Year must be an integer")
    .min(0, "Year must be realistic"),
  gender: Gender,
  bloodGroup: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),

  userId: z.string(),
});

export const CreatePatientSchema = PatientBaseSchema;

export const UpdatePatientSchema = PatientBaseSchema.partial().extend({
  id: z.string(),
});
export type CreatePatientInput = z.infer<typeof CreatePatientSchema>;
export type UpdatePatientInput = z.infer<typeof UpdatePatientSchema>;
