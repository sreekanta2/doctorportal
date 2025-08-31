import { z } from "zod";

export const DoctorReviewSchema = z.object({
  id: z.string().optional(), // for updates
  reviewerId: z.string({
    required_error: "Reviewer ID is required",
  }),
  doctorId: z.string({
    required_error: "Doctor ID is required",
  }),
  rating: z.number({ required_error: "Rating is required" }).min(1).max(5),
  status: z.string().default("pending"),
  comment: z.string().min(2, "Please write something"),
});

export const CreateDoctorReviewSchema = DoctorReviewSchema;

// For update: make all fields optional except `id`
export const UpdateDoctorReviewSchema = DoctorReviewSchema.partial().extend({
  id: z.string({
    required_error: "Review ID is required for update",
  }),
});
export type DoctorReviewCreateInput = z.infer<typeof DoctorReviewSchema>;

// Type for updating a doctor review
export type DoctorReviewUpdateInput = z.infer<typeof UpdateDoctorReviewSchema>;
