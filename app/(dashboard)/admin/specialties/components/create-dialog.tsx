"use client";

import {
  createSpecialization,
  updateSpecialization,
} from "@/action/action.specialties";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import SubmitButton from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  CreateSpecializationInput,
  createSpecializationSchema,
  UpdateSpecializationInput,
} from "@/zod-validation/specialties";

import { zodResolver } from "@hookform/resolvers/zod";
import { Specialization } from "@prisma/client";
import { Edit, Plus } from "lucide-react";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function SpecialtiesCreateDialog({
  specialty,
}: {
  specialty?: Specialization;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateSpecializationInput | UpdateSpecializationInput>({
    resolver: zodResolver(createSpecializationSchema),
    defaultValues: {
      name: "",
      totalDoctors: 0,
    },
  });

  useEffect(() => {
    if (specialty) {
      form.reset({
        name: specialty.name,
        totalDoctors: specialty.totalDoctors,
      });
    }
  }, [specialty, form]);

  const onSubmit = async (
    data: CreateSpecializationInput | UpdateSpecializationInput
  ) => {
    startTransition(async () => {
      try {
        let result;
        let successMessage = "";

        if (specialty) {
          // Edit mode
          const updateData: UpdateSpecializationInput = {
            id: specialty.id,
            ...data,
          };
          result = await updateSpecialization(updateData);
          successMessage = "Specialization updated successfully!";
        } else {
          // Create mode
          result = await createSpecialization(
            data as CreateSpecializationInput
          );
          successMessage = "Specialization created successfully!";
        }

        if (!result?.success) {
          toast.error(
            result?.errors?.[0]?.message || "Something went wrong. Try again."
          );
        } else {
          toast.success(successMessage);
          form.reset(); // reset after success
        }
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."
        );
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="soft">
          {specialty ? <Edit size={16} /> : <Plus size={16} />}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-lg">
        <DialogHeader className="px-6 py-4 border-b bg-gray-50 rounded-t-lg">
          <DialogTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Plus size={20} />
            Create Specialization
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 p-6"
          >
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="Specialization Name"
              placeholder="Enter the name of your specialization"
              className="bg-white"
            />

            {/* Submit Section */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200 mt-8">
              <button
                type="button"
                className="px-5 py-2.5 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                onClick={() => form.reset()}
              >
                Reset
              </button>
              <SubmitButton
                isLoading={isPending}
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                {specialty ? "Update Specialty" : "Create Specialty"}
              </SubmitButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
