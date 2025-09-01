"use client";

import { adminDoctorCreate } from "@/action/action.admin-doctor";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { CreateDoctorInput, createDoctorSchema } from "@/zod-validation/doctor";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFetchOptions } from "@/hooks/useFetchCities";
import { Gender } from "@prisma/client";

export default function DoctorDialogAdd() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateDoctorInput>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "Srikanto3@#",
      image: "",
      degree: "",
      specialization: "",
      city: "",
      website: "",
      country: "Bangladesh",
      hospital: "",
      gender: undefined,
    },
  });
  const { options: cities, loading: citiesLoading } =
    useFetchOptions("/api/cities");
  const { options: specializations, loading: specLoading } =
    useFetchOptions("/api/specialties");

  const onSubmit: SubmitHandler<CreateDoctorInput> = (data) => {
    startTransition(async () => {
      try {
        const result = await adminDoctorCreate(data);

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
        <Button>Add New Doctor</Button>
      </DialogTrigger>
      <DialogContent className="w-full h-[95vh] overflow-y-auto   ">
        <DialogHeader>
          <DialogTitle>Add New Doctor</DialogTitle>
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
                  required
                  className="bg-white"
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
            <div className=" space-y-3 border rounded-md p-6 shadow-md">
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
                loading={specLoading}
                options={specializations}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="hospital"
                label="Hospital/Clinic"
                placeholder="City Hospital"
              />

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="city"
                label="City"
                loading={citiesLoading}
                options={cities}
                placeholder="Enter city"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="website"
                label="Website"
                placeholder="website url"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline">
                <DialogClose>Cancel</DialogClose>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Processing..." : "Create Doctor"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
