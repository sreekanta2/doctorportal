import { z } from "zod";

const cuid = z.string().cuid();
const trimmedNonEmpty = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Name must be at most 100 characters");

export const createSpecializationSchema = z.object({
  name: trimmedNonEmpty,

  totalDoctors: z.coerce
    .number()
    .int("Must be an integer")
    .min(0, "Cannot be negative")
    .optional(),
});
export type CreateSpecializationInput = z.infer<
  typeof createSpecializationSchema
>;

export const updateSpecializationSchema = z.object({
  id: cuid,
  name: trimmedNonEmpty.optional(),
  totalDoctors: z.coerce
    .number()
    .int("Must be an integer")
    .min(0, "Cannot be negative")
    .optional(),
});
export type UpdateSpecializationInput = z.infer<
  typeof updateSpecializationSchema
>;
