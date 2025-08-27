// schemas/medicalHistory.schema.ts
import { z } from "zod";

// Common limits
const TITLE_MAX = 120;
const DESC_MAX = 5000;

// Base (shared) shape
const medicalHistoryBase = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, "Title is required")
    .max(TITLE_MAX, `Title must be ≤ ${TITLE_MAX} characters`),

  description: z
    .string()
    .max(DESC_MAX, `Description must be ≤ ${DESC_MAX} characters`)
    .optional()
    // allow empty string but store as undefined
    .transform((v) => (v === "" ? undefined : v)),

  // Accepts "2025-08-22" or Date; rejects future dates
  date: z.coerce
    .date({ required_error: "Date is required" })
    .max(new Date(), "Date cannot be in the future"),

  // Store uploaded file URL (e.g., Cloudinary secure_url)
  document: z
    .string({ required_error: "Document  is required" })
    .url("Invalid document URL"),
  doctorId: z.string().cuid("Invalid doctor id"),
  patientId: z.string().cuid("Invalid patient id"),
});

// Create
export const medicalHistoryCreateSchema = medicalHistoryBase;

// Update (partial fields, requires id)
export const medicalHistoryUpdateSchema = medicalHistoryBase
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

// Query / filter (useful for listing with range + pagination)
export const medicalHistoryQuerySchema = z
  .object({
    patientId: z.string().cuid().optional(),
    doctorId: z.string().cuid().optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .refine((q) => !(q.from && q.to) || q.from <= q.to, {
    path: ["to"],
    message: "`to` must be on/after `from`",
  });

// Types
export type MedicalHistoryCreateInput = z.infer<
  typeof medicalHistoryCreateSchema
>;
export type MedicalHistoryUpdateInput = z.infer<
  typeof medicalHistoryUpdateSchema
>;
export type MedicalHistoryQueryInput = z.infer<
  typeof medicalHistoryQuerySchema
>;
