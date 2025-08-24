"use client";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { User } from "@/components/svg";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Rating } from "@/components/ui/rating";
import { avatar } from "@/config/site";
import {
  DoctorReviewCreateType,
  DoctorReviewSchema,
} from "@/zod-validation/doctor-review-scema";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface ReviewFormProps {
  doctorId: string;
}

export default function ReviewForm({ doctorId }: ReviewFormProps) {
  const [isPending, startTransition] = useTransition();

  const session = true;

  const form = useForm<DoctorReviewCreateType>({
    resolver: zodResolver(DoctorReviewSchema),
    defaultValues: {
      comment: "",
      doctorId: doctorId,
      patientId: "",
      rating: undefined,
    },
  });

  const currentRating = form.watch("rating");

  const onSubmit: SubmitHandler<DoctorReviewCreateType> = (data) => {
    // Handle form submission
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
              {session ? (
                <Image
                  src={avatar}
                  alt={`${"User"} profile picture`}
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
            <fieldset className="space-y-2">
              <legend className="text-base font-medium text-default-700 mb-1">
                Your Rating
              </legend>
              <Rating
                value={currentRating}
                onChange={(value: number) => form.setValue("rating", value)}
                className="gap-x-1.5 max-w-[125px]"
                error={form.formState.errors.rating?.message}
                aria-label="Rate your experience from 1 to 5 stars"
              />
              {form.formState.errors.rating && (
                <p className="text-base text-red-500">
                  {form.formState.errors.rating.message}
                </p>
              )}
            </fieldset>
          </div>
          <div className="flex-1 space-y-4">
            {/* Rating Section */}

            {/* Comment Section */}
            <div className="w-full">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="comment"
                label="Write a detailed review"
                placeholder="Share your experience with this doctor..."
                aria-label="Review comment"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-2">
              <Button
                type="submit"
                variant="outline"
                disabled={isPending}
                className="min-w-[120px]"
                aria-label="Submit review"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
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
