import { z } from "zod";

export const DoctorReviewSchema = z.object({
  patientId: z.string({
    required_error: "Patient ID is required",
  }),
  doctorId: z.string({
    required_error: "Doctor ID is required",
  }),
  rating: z
    .number({
      required_error: "Rating is required",
      invalid_type_error: "Rating must be a number",
    })
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5")
    .default(1),
  comment: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// For update: make all fields optional except `id`
export const UpdateDoctorReviewSchema = DoctorReviewSchema.partial().extend({
  id: z.string({
    required_error: "Review ID is required for update",
  }),
});
export type DoctorReviewCreateType = z.infer<typeof DoctorReviewSchema>;

// Type for updating a doctor review
export type DoctorReviewUpdateType = z.infer<typeof UpdateDoctorReviewSchema>;
