"use client";

import { updateUserAndPatientAction } from "@/action/action.patient";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import ResetButton from "@/components/reset-button";
import SubmitButton from "@/components/submit-button";
import { Form } from "@/components/ui/form";
import { PatientWithRelations } from "@/types";
import {
  UpdatePatientInput,
  UpdatePatientSchema,
} from "@/zod-validation/patient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import "react-phone-number-input/style.css";

export default function PatientForm({
  patient,
}: {
  patient: PatientWithRelations;
}) {
  const [isPending, startTransition] = useTransition();
  const user = useSession();
  const form = useForm<UpdatePatientInput>({
    resolver: zodResolver(UpdatePatientSchema),
    defaultValues: {
      name: "",
      image: patient?.user?.image || "",
      email: "",
      phoneNumber: "",
      age: undefined,
      gender: undefined,
      bloodGroup: undefined,
      street: "",
      country: "",
      city: "",

      userId: "",
      id: "",
    },
  });
  useEffect(() => {
    if (patient || user) {
      form.reset({
        name: user?.data?.user?.name || "",
        image: user?.data?.user?.image || patient?.user?.image || "",
        email: user?.data?.user?.email || patient?.user?.email || "",
        phoneNumber: patient?.phoneNumber || "",
        age: patient?.age || undefined,
        gender: patient?.gender || undefined,
        bloodGroup: patient?.bloodGroup || undefined,
        street: patient?.street || "",
        country: patient?.country || "",
        city: patient?.city || "",

        userId: user?.data?.user?.id || "",
        id: user?.data?.user?.id || patient?.userId || "",
      });
    }
  }, [user?.data?.user, patient, form]);

  const onSubmit: SubmitHandler<UpdatePatientInput> = (formData) => {
    startTransition(async () => {
      try {
        const result = await updateUserAndPatientAction(formData, null);

        if (result.success) {
          toast.success("Patient profile updated successfully!");
        } else {
          toast.error(result.message || "Failed to update patient profile");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
        console.error("Submission error:", error);
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="space-y-6 bg-card p-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Profile Section */}
        <div className="space-y-6">
          <CustomFormField
            fieldType={FormFieldType.FILE_UPLOAD}
            control={form.control}
            name="image"
            label="Profile Picture"
            required
          />

          {/* Personal Information Section */}
          <div className="border p-4 rounded-md space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="flex items-center gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="name"
                label="Name"
                placeholder="Enter your name"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
                disabled
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="age"
                label="Age"
                type="number"
                min={0}
                placeholder="Enter your age"
              />
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="gender"
                label="Gender"
                options={[
                  { value: "MALE", label: "Male" },
                  { value: "FEMALE", label: "Female" },
                ]}
                placeholder="Select gender"
                required
              />

              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phoneNumber"
                label="Phone number"
                placeholder="(555) 123-4567"
                required
              />

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="bloodGroup"
                label="Blood Group"
                options={[
                  { value: "A+", label: "A+" },
                  { value: "A-", label: "A-" },
                  { value: "B+", label: "B+" },
                  { value: "B-", label: "B-" },
                  { value: "AB+", label: "AB+" },
                  { value: "AB-", label: "AB-" },
                  { value: "O+", label: "O+" },
                  { value: "O-", label: "O-" },
                ]}
                placeholder="Select blood group"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="street"
                control={form.control}
                label="Address"
                placeholder="Enter your street address"
                required
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="city"
                control={form.control}
                label="City"
                placeholder="Enter your city"
                required
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="country"
                control={form.control}
                label="Country"
                placeholder="Enter your country"
                required
              />

              {/* Medical Information Section */}
            </div>
          </div>
        </div>
        {/* Submit and Reset Buttons */}
        <div className="flex gap-x-4 justify-end">
          <ResetButton
            variant="soft"
            color="destructive"
            onClick={() => form.reset()}
          >
            Reset
          </ResetButton>
          <SubmitButton variant="soft" color="info" isLoading={isPending}>
            Save Changes
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
