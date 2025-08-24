"use client";

import {
  createScheduleAction,
  updateSchedule,
} from "@/action/action.schedules";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { WeekDaySchema } from "@/zod-validation/enum";
import {
  createScheduleSchema,
  updateScheduleSchema,
} from "@/zod-validation/schedule";

import { zodResolver } from "@hookform/resolvers/zod";
import { Schedule } from "@prisma/client";

import { Pencil, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

interface ScheduleModalProps {
  membershipId: string;
  schedule?: Schedule;
  children?: React.ReactNode;
}

export function ScheduleModal({
  membershipId,
  schedule,
  children,
}: ScheduleModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const isEditMode = !!schedule;

  // 👇 Schema & Type Setup
  const schema = isEditMode ? updateScheduleSchema : createScheduleSchema;
  type FormValue = z.infer<typeof schema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      membershipId,
      startDay: schedule?.startDay ?? undefined,
      endDay: schedule?.endDay ?? undefined,
      startTime: schedule?.startTime ?? "",
      endTime: schedule?.endTime ?? "",

      ...(isEditMode && { id: schedule?.id }),
    },
  });

  const dayOptions = WeekDaySchema.options.map((day) => ({
    value: day,
    label: day.charAt(0) + day.slice(1).toLowerCase(), // "MONDAY" => "Monday"
  }));

  const onSubmit: SubmitHandler<FormValue> = async (data) => {
    // You might want to prevent submission if in pending state already
    if (isPending) return;

    // Wrap the asynchronous logic that calls server actions
    startTransition(async () => {
      try {
        const result = isEditMode
          ? await updateSchedule({ ...data, id: schedule?.id })
          : await createScheduleAction(data);

        if (!result?.success) {
          toast.error(result?.errors?.[0]?.message || "Request failed");
        } else {
          setIsOpen(false);
          form.reset();
          toast.success(
            `Schedule ${isEditMode ? "updated" : "added"} successfully`
          );
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "An error occurred"
        );
      }
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" variant={isEditMode ? "ghost" : "soft"}>
            {isEditMode ? (
              <Pencil className="h-4 w-4" />
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Schedule
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Schedule" : "Add New Schedule"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Start Day */}
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="startDay"
              label="Start day"
              required
              options={dayOptions}
              placeholder="Select gender"
            />
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="endDay"
              label="End day"
              required
              options={dayOptions}
              placeholder="Select gender"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="startTime"
              label="Start Time"
              type="time"
              required
              options={dayOptions}
              placeholder="00.00"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="endTime"
              label="End Time"
              type="time"
              required
              options={dayOptions}
              placeholder="00.00"
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader /> : isEditMode ? "Update" : "Add"}{" "}
                Schedule
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
