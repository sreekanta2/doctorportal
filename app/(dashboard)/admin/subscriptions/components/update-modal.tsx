"use client";

import { createOrUpdateSubscription } from "@/action/action.subscription";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { SubscriptionWithRelations } from "@/types";
import {
  UpdateSubscriptionInput,
  UpdateSubscriptionSchema,
} from "@/zod-validation/subscription";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

interface UpdateReviewDialogProps {
  subscription: SubscriptionWithRelations;
}

export default function UpdateSubscriptionDialog({
  subscription,
}: UpdateReviewDialogProps) {
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  const form = useForm<UpdateSubscriptionInput>({
    resolver: zodResolver(UpdateSubscriptionSchema),
    defaultValues: {
      id: subscription?.id ?? "",
      status: subscription?.status,
      pricePlanId: subscription?.pricePlanId,
      email: subscription?.clinic?.user?.email || "",
      bkashNumber: subscription?.bkashNumber,
      transactionId: subscription?.transactionId || undefined,
      endDate: subscription?.endDate || undefined,
      startDate: new Date(),
    },
  });

  useEffect(() => {
    if (subscription) {
      form.reset({
        id: subscription?.id ?? "",
        status: subscription?.status,
        pricePlanId: subscription?.pricePlanId,
        email: subscription?.clinic?.user?.email || "",
        bkashNumber: subscription?.bkashNumber,
        transactionId: subscription?.transactionId || undefined,
        startDate: subscription?.startDate,
        endDate: subscription?.endDate,
      });
    }
  }, [subscription, form, session?.user]);
  console.log(form.formState.errors);
  const onSubmit: SubmitHandler<UpdateSubscriptionInput> = (data) => {
    if (!data.id) {
      toast.error("Subscription ID is required");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createOrUpdateSubscription(data);

        if (!result?.success) {
          toast.error(result?.errors?.[0]?.message || "Operation failed");
        } else {
          toast.success("Subscription updated successfully!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger className="border p-2 rounded-md bg-primary-200 text-default-600">
        <Edit className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Subscription</DialogTitle>
          <DialogDescription>
            Change the subscription status and transaction ID.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-2"
          >
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="status"
              label="Status"
              placeholder="Select status"
              required
              options={[
                { value: "ACTIVE", label: "ACTIVE" },
                { value: "INACTIVE", label: "INACTIVE" },
                { value: "EXPIRED", label: "EXPIRED" },
                { value: "CANCELED", label: "CANCELED" },
              ]}
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="transactionId"
              label="Transaction ID"
              placeholder="Enter transaction ID"
              required
            />
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="endDate"
              label="End Date"
              placeholder="Enter end date"
              required
            />

            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
