"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { adminDoctorUpdate } from "@/action/action.admin-doctor";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFetchOptions } from "@/hooks/useFetchCities";
import { DoctorWithRelations } from "@/types";
import { UpdateDoctorInput, updateDoctorSchema } from "@/zod-validation/doctor";
import { Gender } from "@prisma/client";

interface DoctorDialogEditProps {
  doctor: DoctorWithRelations;
}

export default function DoctorDialogEdit({ doctor }: DoctorDialogEditProps) {
  const [isPending, startTransition] = useTransition();

  // fetch cities & specializations
  const { options: cities, loading: citiesLoading } =
    useFetchOptions("/api/cities");

  const { options: specializations, loading: specLoading } =
    useFetchOptions("/api/specialties");

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
      website: "",
      country: "Bangladesh",
      hospital: "",
      gender: undefined,
      id: "",
    },
  });

  // Update form values when doctor data is loaded
  useEffect(() => {
    if (!doctor) return;

    form.reset({
      name: doctor?.user?.name ?? "",
      email: doctor?.user?.email ?? "",
      password: "",
      image: doctor?.user?.image ?? "",
      degree: doctor?.degree ?? "",
      specialization: doctor?.specialization ?? "",
      city: doctor?.city ?? "",

      country: doctor.country ?? "",
      website: doctor?.website ?? "",

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
                  name="gender"
                  control={form.control}
                  className="w-full"
                  label="Gender"
                  options={[
                    { value: Gender.MALE, label: "Male" },
                    { value: Gender.FEMALE, label: "Female" },
                    { value: Gender.OTHER, label: "Other" },
                  ]}
                />
              </CardContent>
            </Card>

            {/* Professional Details */}
            <div className="space-y-4">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="specialization"
                label="Specialization"
                options={specializations}
                loading={specLoading}
                required
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="degree"
                label="Degree"
                placeholder="MBBS, MD"
                required
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="hospital"
                label="Hospital/Clinic"
                placeholder="City Hospital"
              />

              {/* Address */}

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="city"
                label="City"
                loading={citiesLoading}
                options={cities}
                placeholder="City"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline">
                <DialogClose>Cancel</DialogClose>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Processing..." : "Update Doctor"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
