"use client";

import { updateUserAndClinicAction } from "@/action/action.clinics";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import SubmitButton from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useFetchOptions } from "@/hooks/useFetchCities";
import { ClinicWithUser } from "@/types";

import { UpdateClinicInput, updateClinicSchema } from "@/zod-validation/clinic";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ClinicProfileForm({
  clinic,
}: {
  clinic: ClinicWithUser | null;
}) {
  const [isPending, startTransition] = useTransition();
  const { options: cities, loading, error } = useFetchOptions("/api/cities");
  const user = useSession();
  const form = useForm<UpdateClinicInput>({
    resolver: zodResolver(updateClinicSchema),
    defaultValues: {
      role: "clinic",
      image: clinic?.image || "",
    },
  });

  useEffect(() => {
    if (clinic || user) {
      form.reset({
        email: user?.data?.user?.email || clinic?.email,
        name: clinic?.name,
        image: clinic?.image || "",
        description: clinic?.clinic?.description || "",
        phoneNumber: clinic?.clinic?.phoneNumber || "",
        role: "clinic",
        city: clinic?.clinic?.city || "",
        country: clinic?.clinic?.country || "Bangladesh",
        openingHour: clinic?.clinic?.openingHour || "",
        website: clinic?.clinic?.website || "",
        establishedYear:
          clinic?.clinic?.establishedYear || new Date().getFullYear(),
      });
    }
  }, [clinic, user, form]);

  const onSubmit: SubmitHandler<UpdateClinicInput> = async (data) => {
    startTransition(async () => {
      try {
        const result = await updateUserAndClinicAction(data, "/admin/clinics");

        if (!result?.success) {
          toast.error(
            result?.errors?.[0]?.message || "Something went wrong. Try again."
          );
        } else {
          toast.success("Clinic updated successfully!");

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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-6 bg-background rounded-md"
      >
        {/* Clinic Image Section */}
        <div className=" space-y-6">
          <div className="w-full flex gap-8  space-y-4">
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
          <div className="w-full flex gap-4 items-center  ">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="Clinic Name"
              placeholder="City Medical Center"
              required
              className="w-full bg-white"
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

          <div className="w-ful flex gap-4 items-center">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="phoneNumber"
              label="Phone Number"
              placeholder="+1 (555) 123-4567"
              required
              className="bg-white  w-full"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email"
              placeholder="contact@clinic.com"
              type="email"
              className="bg-white w-full"
              disabled
            />
          </div>

          <div className="w-ful flex gap-4 items-center">
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="city"
              label="City"
              loading={loading}
              options={cities}
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

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="description"
            label="Clinic Description"
            placeholder="Tell patients about your clinic, services, and values..."
            className="bg-white"
          />
        </div>

        {/* Submit Section */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200 mt-8">
          <Button
            variant="soft"
            color="destructive"
            type="button"
            className="px-5 py-2.5 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <SubmitButton
            isLoading={isPending}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            {isPending ? "Processing" : "Update"}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
