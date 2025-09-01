"use client";

import { updateAdminUserAndClinicAction } from "@/action/action.admin-doctor";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import Loader from "@/components/loader";
import SubmitButton from "@/components/submit-button";
import { Error } from "@/components/svg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useFetchOptions } from "@/hooks/useFetchCities";
import { ClinicWithRelations } from "@/types";
import { UpdateClinicInput, updateClinicSchema } from "@/zod-validation/clinic";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ClinicEditDialog({
  clinic,
}: {
  clinic: ClinicWithRelations;
}) {
  const [isPending, startTransition] = useTransition();
  const { options: cities, loading, error } = useFetchOptions("/api/cities");
  const router = useRouter();

  const form = useForm<UpdateClinicInput>({
    resolver: zodResolver(updateClinicSchema),
    defaultValues: {
      role: "clinic",
    },
  });

  useEffect(() => {
    if (clinic) {
      form.reset({
        email: clinic.user.email,
        name: clinic.user.name,
        image: clinic.user.image || "",
        description: clinic.description || "",
        phoneNumber: clinic.phoneNumber || "",

        role: "clinic",
        city: clinic.city || "",

        country: clinic.country || "",
        openingHour: clinic.openingHour || "",
        establishedYear: clinic.establishedYear || new Date().getFullYear(),
      });
    }
  }, [clinic, form]);

  const onSubmit: SubmitHandler<UpdateClinicInput> = async (data) => {
    startTransition(async () => {
      try {
        const result = await updateAdminUserAndClinicAction(data);

        if (!result?.success) {
          toast.error(
            result?.errors?.[0]?.message || "Something went wrong. Try again."
          );
        } else {
          toast.success("Clinic updated successfully!");
          form.reset();
          router.refresh();
        }
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg">
          <Pencil size={16} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-lg">
        <DialogHeader className="px-6 py-4 border-b bg-gray-50 rounded-t-lg">
          <DialogTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Plus size={20} />
            Create Clinic Profile
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="p-6">
            <Loader />
          </div>
        ) : error ? (
          <div className="p-6">
            <Error error={error} reset={() => router.refresh()} />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 p-6"
            >
              {/* Clinic Image Section */}
              <div className="flex flex-col   gap-8 items-start">
                <div className="w-full flex gap-8  space-y-4">
                  {/* <AdminImageUpload
                  setImage={setImage}
                  initialImage={clinic.user.image || ""}
                  email={clinic.user.email}
                /> */}
                  <CustomFormField
                    fieldType={FormFieldType.FILE_UPLOAD}
                    control={form.control}
                    name="image"
                    label="Clinic Name"
                    placeholder="City Medical Center"
                    required
                    className="bg-white"
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
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="city"
                  label="City"
                  placeholder={loading ? "Loading cities..." : "Select a city"}
                  required
                  options={cities}
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
                  Update
                </SubmitButton>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
