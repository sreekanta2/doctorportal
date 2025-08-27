"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";

import { updateMedicalHistory } from "@/action/action.medical-history";
import { medicalHistoryUpdateSchema } from "@/zod-validation/medical-history";
import { MedicalHistory } from "@prisma/client";

interface MedicalRecordsUpdateDialogProps {
  medicalHistory: MedicalHistory;
}

export default function MedicalRecordsUpdateDialog({
  medicalHistory,
}: MedicalRecordsUpdateDialogProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof medicalHistoryUpdateSchema>>({
    resolver: zodResolver(medicalHistoryUpdateSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      document: "",
      patientId: "",
      id: "",
    },
  });

  useEffect(() => {
    if (!medicalHistory) return;

    form.reset({
      id: medicalHistory.id,
      title: medicalHistory.title || "",
      description: medicalHistory.description || "",
      date: new Date(medicalHistory.date),
      document: medicalHistory.document || "",
      patientId: medicalHistory.patientId,
    });
  }, [medicalHistory, form]);

  const onSubmit: SubmitHandler<z.infer<typeof medicalHistoryUpdateSchema>> = (
    data
  ) => {
    startTransition(async () => {
      try {
        const result = await updateMedicalHistory(data);

        if (result?.success) {
          toast.success("Medical record updated successfully");
        } else {
          toast.error(result?.errors?.[0]?.message || "Update failed");
        }
      } catch (error) {
        console.error("Error updating medical history:", error);
        toast.error("Something went wrong.");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>

      <DialogContent className="w-full h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Medical Record</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="title"
              control={form.control}
              placeholder="e.g. Diabetes Checkup"
              label="Title"
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name="description"
              control={form.control}
              placeholder="Details about the visit..."
              label="Description"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="date"
              control={form.control}
              type="date"
              label="Date"
            />
            <CustomFormField
              fieldType={FormFieldType.FILE_UPLOAD}
              name="document"
              control={form.control}
              label="Document"
              file
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
