"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { UpdateDoctorInput, updateDoctorSchema } from "@/zod-validation/doctor";

import { adminDoctorUpdate } from "@/action/action.admin-doctor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DOCTOR_SPECIALTIES } from "@/lib/utils/utils";
import { DoctorWithRelations } from "@/types";

interface DoctorDialogEditProps {
  doctor: DoctorWithRelations;
}

export default function DoctorDialogEdit({ doctor }: DoctorDialogEditProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<UpdateDoctorInput>({
    resolver: zodResolver(updateDoctorSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      image: "",
      degree: "",
      specialization: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      street: "",
      hospital: "",
      gender: undefined,
      id: "",
    },
  });

  // Update form values when doctor data is loaded
  useEffect(() => {
    if (!doctor) return;

    form.reset({
      name: doctor.user?.name ?? "",
      email: doctor.user?.email ?? "",
      password: "",
      image: doctor.user?.image ?? "",
      degree: doctor.degree ?? "",
      specialization: doctor.specialization ?? "",
      city: doctor.city ?? "",
      state: doctor.state ?? "",
      country: doctor.country ?? "",
      zipCode: doctor.zipCode ?? "",
      street: doctor.street ?? "",
      hospital: doctor.hospital ?? "",
      gender: doctor.gender ?? undefined,
      id: doctor.id ?? "",
    });
  }, [doctor, form]);

  const onSubmit: SubmitHandler<UpdateDoctorInput> = (data) => {
    startTransition(async () => {
      try {
        const result = await adminDoctorUpdate(data);
        if (result?.success) {
          toast.success("Doctor updated successfully");
        } else {
          toast.error(result?.errors?.[0]?.message || "Update failed");
        }
      } catch (error) {
        console.error("Error updating doctor:", error);
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
          <DialogTitle>Edit Doctor</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CustomFormField
                  fieldType={FormFieldType.FILE_UPLOAD}
                  control={form.control}
                  name="image"
                  label="Upload Image"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="name"
                  label="Full Name"
                  placeholder="John Doe"
                  required
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="john.doe@example.com"
                  required
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="gender"
                  label="Gender"
                  options={[
                    { value: "", label: "Select Gender" },
                    { value: "MALE", label: "Male" },
                    { value: "FEMALE", label: "Female" },
                    { value: "OTHER", label: "Other" },
                  ]}
                />
              </CardContent>
            </Card>

            {/* Professional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="degree"
                  label="Degree"
                  placeholder="MBBS, MD"
                  required
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="specialization"
                  label="Specialization"
                  options={DOCTOR_SPECIALTIES}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="hospital"
                  label="Hospital/Clinic"
                  placeholder="City Hospital"
                />
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="street"
                  label="Street Address"
                  placeholder="123 Medical Center Drive"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="city"
                  label="City"
                  placeholder="New York"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="state"
                  label="State"
                  placeholder="Dinajpur"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="country"
                  label="Country"
                  placeholder="United States"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="zipCode"
                  label="ZIP/Postal Code"
                  placeholder="10001"
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update Doctor"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
