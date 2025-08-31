"use client";

import {
  createClinicReviewAction,
  updateClinicReviewAction,
} from "@/action/action.clinic-review";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { User } from "@/components/svg";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Rating } from "@/components/ui/rating";
import {
  ClinicReviewCreateInput,
  ClinicReviewUpdateInput,
  CreateClinicReviewSchema,
} from "@/zod-validation/clinicReviewSchema";

import { zodResolver } from "@hookform/resolvers/zod";
import { DoctorReview } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ReviewFormProps {
  clinicId?: string;
  review?: DoctorReview;
  setEditingReview?: (review: DoctorReview | null) => void;
}

export default function PatientReviewForm({
  clinicId,
  review,
  setEditingReview,
}: ReviewFormProps) {
  const [isPending, startTransition] = useTransition();
  const user = useSession();

  const form = useForm<ClinicReviewCreateInput | ClinicReviewUpdateInput>({
    resolver: zodResolver(CreateClinicReviewSchema),
    defaultValues: {
      comment: review?.comment || "",
      clinicId,
      reviewerId: "",
      rating: review?.rating ?? undefined,
      status: review?.status || "pending",
      id: review?.id,
    },
  });

  useEffect(() => {
    if (user?.data?.user?.id) {
      form.reset({
        comment: review?.comment || "",
        clinicId,
        reviewerId: user?.data?.user?.id,
        rating: review?.rating ?? undefined,
      });
    }
  }, [user?.data?.user?.id, review, clinicId, form]);

  const currentRating = form.watch("rating");
  const onSubmit = async (
    data: ClinicReviewCreateInput | ClinicReviewUpdateInput
  ) => {
    startTransition(async () => {
      try {
        let result;

        if (review) {
          // update flow
          const updateData: ClinicReviewUpdateInput = {
            id: review.id,
            comment: data.comment,
            reviewerId: data.reviewerId!,
            rating: data.rating,
            status: data.status,
            clinicId: data.clinicId!,
          };
          result = await updateClinicReviewAction(review.id, updateData);
        } else {
          // create flow
          const createData: ClinicReviewCreateInput = {
            clinicId: data.clinicId!,
            reviewerId: data.reviewerId!,
            rating: data.rating!,
            comment: data.comment!,
            status: "pending",
          };
          result = await createClinicReviewAction(createData);
        }

        if (!result?.success) {
          toast.error(result?.errors?.[0]?.message || "Operation failed");
        } else {
          toast.success(
            review ? "Your review has been updated" : "Your review is pending"
          );
          form.reset();
          setEditingReview?.(null);
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <section
      aria-labelledby="review-form-heading"
      className="bg-card p-6 rounded-lg shadow-sm border"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-start gap-4">
            {/* User Avatar */}
            <figure className="flex-shrink-0">
              {user?.data?.user?.image ? (
                <Image
                  src={user.data.user.image}
                  alt={`${user.data.user.name} profile picture`}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                  priority
                />
              ) : (
                <div className="p-2 bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <User className="text-primary-600" />
                </div>
              )}
            </figure>

            {/* Rating */}
            <fieldset className="space-y-2">
              <legend className="text-base font-medium text-default-700 mb-1">
                {user?.data?.user?.name}
              </legend>
              <Rating
                value={currentRating || 0}
                onChange={(value: number) => form.setValue("rating", value)}
                className="gap-x-1.5 max-w-[125px]"
                error={form.formState.errors.rating?.message}
                aria-label="Rate your experience from 1 to 5 stars"
              />
            </fieldset>
          </div>

          <div className="flex-1 space-y-4">
            {/* Comment Section */}
            <div className="w-full">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="comment"
                label="Write a detailed review"
                placeholder="Share your experience with this doctor..."
                aria-label="Review comment"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-2">
              <Button
                type="submit"
                variant="outline"
                disabled={isPending}
                className="min-w-[120px]"
                aria-label={review ? "Update review" : "Submit review"}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : review ? (
                  "Update Review"
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
}
