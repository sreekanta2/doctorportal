"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { createMedicalHistory } from "@/action/action.medical-history";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { medicalHistoryCreateSchema } from "@/zod-validation/medical-history";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { z } from "zod";

export default function MedicalRecordsAddDialog({
  doctorId,
}: {
  doctorId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const user = useSession();
  const form = useForm<z.infer<typeof medicalHistoryCreateSchema>>({
    resolver: zodResolver(medicalHistoryCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      document: "",
      doctorId,
      patientId: user?.data?.user?.id || "",
    },
  });

  // ✅ Reset safely when dependencies change
  useEffect(() => {
    if (!doctorId && !user?.data?.user?.id) return;

    form.reset({
      doctorId,
      patientId: user?.data?.user?.id || "",
    });
  }, [doctorId, user?.data?.user?.id, form]);

  const onSubmit: SubmitHandler<z.infer<typeof medicalHistoryCreateSchema>> = (
    data
  ) => {
    startTransition(async () => {
      try {
        const result = await createMedicalHistory(data);

        if (result?.success) {
          toast.success("Doctor created successfully");
          form.reset();
        } else {
          toast.error(result?.errors?.[0]?.message || "Creation failed");
        }
      } catch (error) {
        console.error("Error saving doctor:", error);
        toast.error("Something went wrong.");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Medical Report</Button>
      </DialogTrigger>

      <DialogContent className="w-full h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Medical Record</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 p-4 border rounded-lg">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="title"
                control={form.control}
                placeholder="e.g. Diabetes Checkup"
                label="Report Title"
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
                placeholder="e.g. Diabetes Checkup"
                label="Document"
                file
                required
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline">
                  <DialogClose>Cancel</DialogClose>
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
