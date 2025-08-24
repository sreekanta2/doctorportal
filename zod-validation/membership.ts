import { z } from "zod";

export const baseClinicMembership = z.object({
  doctorId: z.string().min(1, "Doctor is required"),
  clinicId: z.string().min(1, "Clinic is required"),
  isActive: z.boolean().default(true),

  maxAppointments: z.coerce
    .number()
    .int("Max appointments must be an integer")
    .min(0, "Max appointments must be a positive integer"),
  fee: z.coerce
    .number()
    .int("Fee must be an integer")
    .min(0, "Fee must be a positive integer"),

  discount: z.coerce
    .number()
    .int("Discount must be an integer")
    .min(0, "Discount must be a positive integer"),
});

export const createClinicMembershipSchema = baseClinicMembership;
export const updateClinicMembershipSchema = baseClinicMembership
  .partial()
  .extend({
    id: z.string().min(2, "Id is required "),
  });

export type CreateClinicMembershipInput = z.infer<
  typeof createClinicMembershipSchema
>;
export type UpdateClinicMembershipInput = z.infer<
  typeof updateClinicMembershipSchema
>;
