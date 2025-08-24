"use client";

import { createOrUpdateUserAndClinicAction } from "@/action/action.clinics";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import SubmitButton from "@/components/submit-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { avatar } from "@/config/site";
import { CreateClinicInput, createClinicSchema } from "@/zod-validation/clinic";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ClinicCreateDialog() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateClinicInput>({
    resolver: zodResolver(createClinicSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "Srikanto3@#", // hidden in real-world
      image: "",
      description: "",
      phoneNumber: "",
      street: "",
      role: "clinic",
      city: "",
      zipCode: "",
      country: "",
      openingHour: "",
      establishedYear: new Date().getFullYear(),
    },
  });

  const onSubmit: SubmitHandler<CreateClinicInput> = async (data) => {
    startTransition(async () => {
      try {
        let result;

        result = await createOrUpdateUserAndClinicAction(data);

        if (!result?.success) {
          toast.error(
            result?.errors?.[0]?.message || "Something went wrong. Try again."
          );
        } else {
          toast.success("Clinic created successfully!");

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
        <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg">
          <Plus size={16} />
          Add Clinic
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-lg">
        <DialogHeader className="px-6 py-4 border-b bg-gray-50 rounded-t-lg">
          <DialogTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Plus size={20} />
            Create Clinic Profile
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 p-6"
          >
            {/* Clinic Image Section */}
            <div className="flex flex-col   gap-8 items-start">
              <div className="w-full flex gap-8  space-y-4">
                <Image
                  src={form.watch("image") || avatar}
                  alt="Clinic Image"
                  className="rounded-full object-cover"
                  width={150}
                  height={150}
                />
                <CustomFormField
                  fieldType={FormFieldType.FILE_UPLOAD}
                  control={form.control}
                  name="image"
                  label="Upload Image"
                  placeholder="Clinic Image"
                  className="w-full"
                />
              </div>

              {/* Basic Information */}
              <div className="w-full   space-y-6">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="name"
                  label="Clinic Name"
                  placeholder="City Medical Center"
                  required
                  className="bg-white"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="establishedYear"
                  label="Established Year"
                  placeholder="2010"
                  type="number"
                  min={1900}
                  max={new Date().getFullYear()}
                  className="bg-white"
                />
              </div>
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="description"
                label="Clinic Description"
                placeholder="Tell patients about your clinic, services, and values..."
                className="bg-white"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="phoneNumber"
                label="Phone Number"
                placeholder="+1 (555) 123-4567"
                required
                className="bg-white"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                placeholder="contact@clinic.com"
                type="email"
                className="bg-white"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="street"
                label="Street Address"
                placeholder="123 Medical Center Drive"
                required
                className="bg-white md:col-span-2"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="city"
                label="City"
                placeholder="New York"
                required
                className="bg-white"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="country"
                label="Country"
                placeholder="United States"
                required
                className="bg-white"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="zipCode"
                label="ZIP/Postal Code"
                placeholder="10001"
                required
                className="bg-white"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="openingHour"
                label="Opening Hours"
                placeholder="Mon-Fri 09:00-17:00"
                required
                className="bg-white"
              />
            </div>

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
                Create Clinic
              </SubmitButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
