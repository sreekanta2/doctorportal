"use client";

import { updateAdminClinicReviewAction } from "@/action/action.admin-doctor";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Rating } from "@/components/ui/rating";
import {
  ClinicReviewUpdateInput,
  UpdateClinicReviewSchema,
} from "@/zod-validation/clinicReviewSchema";
import { DoctorReviewUpdateInput } from "@/zod-validation/doctor-review-scema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

interface UpdateReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  review: {
    id: string;
    comment: string;
    clinicId: string;
    reviewerId?: string;
    rating: number;
    status: string;
  };
  onUpdate?: (updatedReview: any) => void;
}

export default function UpdateReviewDialog({
  isOpen,
  onClose,
  review,
  onUpdate,
}: UpdateReviewDialogProps) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ClinicReviewUpdateInput>({
    resolver: zodResolver(UpdateClinicReviewSchema),
    defaultValues: {
      id: review.id,
      comment: review.comment,
      clinicId: review.clinicId,
      reviewerId: session?.user.id || "",
      rating: review.rating,
      status: review.status,
    },
  });

  useEffect(() => {
    if (session?.user.id) {
      form.reset({
        id: review.id,
        comment: review.comment,
        clinicId: review.clinicId,
        reviewerId: session.user.id,
        rating: review.rating,
        status: review.status,
      });
    }
  }, [session?.user.id, review, form]);

  const currentRating = form.watch("rating");

  const onSubmit: SubmitHandler<DoctorReviewUpdateInput> = (data) => {
    if (!data.id && data?.reviewerId) {
      toast.error("Review ID is required");
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateAdminClinicReviewAction(data);

        if (!result?.success) {
          toast.error(result?.errors?.[0]?.message || "Operation failed");
        } else {
          toast.success("Review updated successfully!");
          form.reset(data);
          onUpdate?.(result.data);
          onClose();
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogDescription>
            Update the review details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-2"
          >
            <fieldset className="space-y-2">
              <legend className="text-base font-medium text-default-700 mb-1">
                Your Rating
              </legend>
              <Rating
                value={currentRating || 0}
                onChange={(value: number) => form.setValue("rating", value)}
                className="gap-x-1.5 max-w-[125px]"
                error={form.formState.errors.rating?.message}
                aria-label="Rate your experience from 1 to 5 stars"
                readOnly
              />
              {form.formState.errors.rating && (
                <p className="text-base text-red-500">
                  {form.formState.errors.rating.message}
                </p>
              )}
            </fieldset>

            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="status"
              label="Review Status"
              placeholder="Select the status"
              required
              options={[
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
              ]}
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="comment"
              label="Write a detailed review"
              placeholder="Share your experience..."
              required
              disabled
            />

            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Review"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
