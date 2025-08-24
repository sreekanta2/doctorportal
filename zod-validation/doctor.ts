import { z } from "zod";

export const baseDoctorSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
  image: z.string().optional(),
  degree: z.string(),

  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  hospital: z.string().optional(),

  street: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),

  specialization: z.string(),
});

export const createDoctorSchema = baseDoctorSchema;

export const updateDoctorSchema = baseDoctorSchema.extend({
  id: z.string().min(1, { message: "ID is required" }),
});

// Type definitions
export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
export type DoctorFormValues = CreateDoctorInput | UpdateDoctorInput;
