import { z } from "zod";

export const ClinicReviewSchema = z.object({
  id: z.string().optional(), // for updates
  reviewerId: z.string({
    required_error: "Reviewer ID is required",
  }),
  clinicId: z.string({
    required_error: "Doctor ID is required",
  }),
  rating: z.number().min(1).max(5),
  status: z.string().default("pending"),
  comment: z.string(),
});

export const CreateClinicReviewSchema = ClinicReviewSchema;

// For update: make all fields optional except `id`
export const UpdateClinicReviewSchema = ClinicReviewSchema.partial().extend({
  id: z.string({
    required_error: "Review ID is required for update",
  }),
});
export type ClinicReviewCreateInput = z.infer<typeof ClinicReviewSchema>;

// Type for updating a clinic review
export type ClinicReviewUpdateInput = z.infer<typeof UpdateClinicReviewSchema>;
