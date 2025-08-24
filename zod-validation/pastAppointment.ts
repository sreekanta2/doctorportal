import { z } from "zod";

const passAppointmentBase = z.object({
  doctorId: z.string().cuid("Invalid doctor id"),
  patientId: z.string().cuid("Invalid patient id"),
});

// Create
export const passAppointmentCreateSchema = passAppointmentBase;

// Update (partial fields, requires id)
export const passAppointmentUpdateSchema = passAppointmentBase
  .partial()
  .extend({
    id: z.string().cuid("Invalid id"),
  })
  .refine(
    (data) =>
      // ensure at least one updatable field is provided besides id
      Object.keys(data).some((k) => k !== "id"),
    { message: "Provide at least one field to update" }
  );

export type passAppointmentCreateInput = z.infer<
  typeof passAppointmentCreateSchema
>;
export type passAppointmentUpdateInput = z.infer<
  typeof passAppointmentUpdateSchema
>;
