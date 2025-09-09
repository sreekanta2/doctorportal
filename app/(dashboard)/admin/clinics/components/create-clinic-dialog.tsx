"use client";

import { createAdminUserAndClinicAction } from "@/action/action.admin-doctor";
import Error from "@/app/error";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import Loader from "@/components/loader";
import SubmitButton from "@/components/submit-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useFetchOptions } from "@/hooks/useFetchCities";
import { CreateClinicInput, createClinicSchema } from "@/zod-validation/clinic";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ClinicCreateDialog() {
  const [isPending, startTransition] = useTransition();
  const { options: cities, loading, error } = useFetchOptions("/api/cities");
  const router = useRouter();
  const form = useForm<CreateClinicInput>({
    resolver: zodResolver(createClinicSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "Srikanto3@#",
      image: "",
      description: "",
      phoneNumber: "",

      role: "clinic",
      city: "",

      country: "বাংলাদেশ",
      openingHour: "",
      establishedYear: undefined,
    },
  });

  const onSubmit: SubmitHandler<CreateClinicInput> = async (data) => {
    startTransition(async () => {
      try {
        const result = await createAdminUserAndClinicAction(data);

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
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  if (loading) {
    <div>
      <Loader />
    </div>;
  }
  const reset = () => {
    router.refresh();
  };
  if (error) {
    <Error error={error} reset={reset} />;
  }
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
              <CustomFormField
                fieldType={FormFieldType.FILE_UPLOAD}
                control={form.control}
                name="image"
                required
                className="bg-white"
              />

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
                required
                className="bg-white"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                placeholder="boss@gmail.com"
                type="email"
                className="bg-white"
              />

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="city"
                label="City"
                placeholder="Dinajpur"
                required
                options={cities}
                className="bg-white"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="openingHour"
                label="Opening Hours"
                placeholder="09:00 Am -9:00 Pm"
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
