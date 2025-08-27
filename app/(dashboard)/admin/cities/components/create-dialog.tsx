"use client";

import { createCity, updateCity } from "@/action/action.city";
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
  CreateCityInput,
  createCitySchema,
  UpdateCityInput,
} from "@/zod-validation/city";

import { zodResolver } from "@hookform/resolvers/zod";
import { City } from "@prisma/client";
import { Edit, Plus } from "lucide-react";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function CityCreateDialog({ city }: { city?: City }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateCityInput | UpdateCityInput>({
    resolver: zodResolver(createCitySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (city) {
      form.reset({
        name: city.name,
      });
    }
  }, [city, form]);

  const onSubmit = async (data: CreateCityInput | UpdateCityInput) => {
    startTransition(async () => {
      try {
        let result;
        let successMessage = "";

        if (city) {
          // Edit mode
          const updateData: UpdateCityInput = {
            id: city.id,
            ...data,
          };
          result = await updateCity(updateData);
          successMessage = "City updated successfully!";
        } else {
          // Create mode
          result = await createCity(data as CreateCityInput);
          successMessage = "City created successfully!";
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
          {city ? <Edit size={16} /> : <Plus size={16} />}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-lg">
        <DialogHeader className="px-6 py-4 border-b bg-gray-50 rounded-t-lg">
          <DialogTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Plus size={20} />
            Create City
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
              label="City Name"
              placeholder="Enter the name of your City"
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
                {city ? "Update City" : "Create City"}
              </SubmitButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
