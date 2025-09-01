import { z } from "zod";

export const baseDoctorSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  image: z.string().optional(),
  degree: z.string().min(4, "Degree are required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  hospital: z.string().optional(),
  city: z.string().min(2, "City are required"),
  country: z.string(),
  specialization: z.string().min(4, "Specialization are required"),
  website: z.string().optional(),
});

export const createDoctorSchema = baseDoctorSchema;

export const updateDoctorSchema = baseDoctorSchema.extend({
  id: z.string().min(1, { message: "ID is required" }),
});

// Type definitions
export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
export type DoctorFormValues = CreateDoctorInput | UpdateDoctorInput;
