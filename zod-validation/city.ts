import { z } from "zod";

const cuid = z.string().cuid();
const trimmedNonEmpty = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Name must be at most 100 characters");

export const createCitySchema = z.object({
  name: trimmedNonEmpty,
});
export type CreateCityInput = z.infer<typeof createCitySchema>;

export const updateCitySchema = z.object({
  id: cuid,
  name: trimmedNonEmpty.optional(),
});
export type UpdateCityInput = z.infer<typeof updateCitySchema>;
