"use client";

import { adminDoctorCreate } from "@/action/action.admin-doctor";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  CreateDoctorInput,
  createDoctorSchema,
  DoctorFormValues,
} from "@/zod-validation/doctor";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DoctorDialogAdd() {
  const [isPending, startTransition] = useTransition();
  const [specialties, setSpecialties] = useState([]);
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
      state: "",
      country: "",
      zipCode: "",
      street: "",
      hospital: "",
      gender: undefined,
    },
  });
  useEffect(() => {
    let isMounted = true; // prevent state update after unmount

    const fetchData = async () => {
      try {
        const fetchSpecialties = async () => {
          const response = await fetch("/api/specialties");
          const data = await response.json();
          return data?.data || [];
        };
        fetchSpecialties().then((specialtiesData) => {
          if (isMounted) {
            setSpecialties(specialtiesData?.data || []);
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // cleanup
    };
  }, []);

  const mappedCities = specialties?.map(
    (city: { id: string; name: string }) => ({
      value: city.name.toLowerCase(),
      label: city.name,
    })
  );
  const onSubmit: SubmitHandler<DoctorFormValues> = (data) => {
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
                  control={form.control}
                  name="gender"
                  label="Gender"
                  options={[
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
                <div className="w-full">
                  <label
                    htmlFor="specialization"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Specialization
                  </label>
                  <select
                    id="specialization"
                    {...form.register("specialization")}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  >
                    <option value="">Select Specialization</option>
                    {mappedCities?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

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
              <Button type="button" variant="outline">
                <DialogClose>Cancel</DialogClose>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Doctor"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
