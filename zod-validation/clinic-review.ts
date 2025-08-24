import { z } from "zod";

export const clinicReviewSchema = z.object({
  comment: z.string().min(2, "Name must be at least 2 characters"),
  clinicId: z.string().min(2, "Name must be at least 2 characters"),
  patientId: z.string().min(2, "Name must be at least 2 characters"),
  rating: z.number().min(1, "Please provide rating"),
});

// For creation - all fields required except ID
export const createClinicSchema = clinicReviewSchema;

// For updates - all fields optional
export const updateClinicSchema = clinicReviewSchema.partial().extend({
  id: z.string().min(1, "ID is required for updates"), // ID becomes required for updates
});
