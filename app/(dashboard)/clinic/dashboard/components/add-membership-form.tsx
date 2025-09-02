"use client";

import { createClinicMembershipCheckSubscription } from "@/action/action.membarsip";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Building, User } from "@/components/svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useFetchOptions } from "@/hooks/useFetchCities";
import { DoctorWithRelations } from "@/types";

import { Gender } from "@/types/common";
import { baseClinicMembership } from "@/zod-validation/membership";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ChevronRightIcon, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react"; // Ensure useTransition is imported
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

// Constants

interface AddDoctorMembershipProps {
  handleBackToList: () => void;
}

type FormValues = z.infer<typeof baseClinicMembership> & {
  search: string;
  specialization: string;
  city: string;
  gender: string;
  maxAppointments: number;
  fee: number;
  discount: number;
};

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function AddDoctorMembership({
  handleBackToList,
}: AddDoctorMembershipProps) {
  const user = useSession();
  const [selectedDoctor, setSelectedDoctor] =
    useState<DoctorWithRelations | null>(null);
  const [doctors, setDoctors] = useState<DoctorWithRelations[]>([]);
  const [isFetchingDoctors, setIsFetchingDoctors] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    options: cities,
    loading: citiesLoading,
    error: citiesError,
  } = useFetchOptions("/api/cities");
  const {
    options: specializations,
    loading: specLoading,
    error: specError,
  } = useFetchOptions("/api/specialties");

  const form = useForm<FormValues>({
    resolver: zodResolver(baseClinicMembership),
    defaultValues: {
      doctorId: "",
      clinicId: user?.data?.user?.id || "",
      isActive: true,
      maxAppointments: undefined,
      discount: undefined,
      search: "",
      specialization: "",
      city: "",
      gender: "",
      fee: undefined,
    },
  });

  const watchedValues = useWatch({ control: form.control });
  const debouncedSearchTerm = useDebounce(watchedValues.search, 500);
  const debouncedSpecialization = useDebounce(
    watchedValues.specialization,
    300
  );
  const debouncedCity = useDebounce(watchedValues.city, 300);
  const debouncedGender = useDebounce(watchedValues.gender, 300);

  const handleSelectDoctor = (doctor: DoctorWithRelations) => {
    setSelectedDoctor(doctor);
    form.setValue("doctorId", doctor.id);
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsFetchingDoctors(true);

        const params = new URLSearchParams();
        if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
        if (debouncedSpecialization)
          params.set("specialization", debouncedSpecialization);
        if (debouncedCity) params.set("city", debouncedCity);
        if (debouncedGender) params.set("gender", debouncedGender);

        // Only fetch if at least one filter is set
        if (params.toString()) {
          const res = await fetch(`/api/admin/doctors?${params.toString()}`);
          const data = await res.json();
          setDoctors(data?.data || []);
        } else {
          setDoctors([]);
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        toast.error("Failed to load doctors");
      } finally {
        setIsFetchingDoctors(false);
      }
    };

    fetchDoctors();
  }, [
    debouncedSearchTerm,
    debouncedSpecialization,
    debouncedCity,
    debouncedGender,
  ]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!selectedDoctor) {
      toast.error("Please select a doctor first");
      return;
    }

    // REMOVE: setIsLoading(true); // Remove this line
    startTransition(async () => {
      try {
        const result = await createClinicMembershipCheckSubscription({
          doctorId: data.doctorId,
          clinicId: data.clinicId,
          isActive: data.isActive,
          maxAppointments: data.maxAppointments,
          discount: data.discount,
          fee: data.fee,
        });

        if (!result?.success) {
          toast.error(result?.errors[0]?.message || "Operation failed");
        } else {
          toast.success(result?.message);
          setSelectedDoctor(null);
          form.reset();
          handleBackToList();
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to add doctor");
      }
    });
  };

  const hasActiveFilters = Boolean(
    watchedValues.search ||
      watchedValues.specialization ||
      watchedValues.city ||
      watchedValues.gender
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBackToList}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Add Doctor</h1>
        </div>
      </div>

      <Form {...form}>
        {/* Pass onSubmit to the form's onSubmit handler */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Search Filters */}
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="search"
              control={form.control}
              placeholder="Search by name, email"
              label="Search"
            />

            <CustomFormField
              fieldType={FormFieldType.SELECT}
              name="specialization"
              control={form.control}
              placeholder="Select Specialization"
              label="Specialty"
              loading={citiesLoading}
              options={specializations}
            />

            <CustomFormField
              fieldType={FormFieldType.SELECT}
              name="city"
              control={form.control}
              placeholder="Select Location"
              label="City"
              loading={citiesLoading}
              options={cities}
            />

            <CustomFormField
              fieldType={FormFieldType.SELECT}
              name="gender"
              control={form.control}
              label="Gender"
              options={[
                { value: Gender.MALE, label: "Male" },
                { value: Gender.FEMALE, label: "Female" },
                { value: Gender.OTHER, label: "Other" },
              ]}
            />
          </div>

          {/* Doctor Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">
              {hasActiveFilters
                ? "Available Doctors"
                : "Apply filters to find doctors"}
            </h2>

            {isFetchingDoctors ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : doctors.length > 0 ? (
              !selectedDoctor ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-card/70 cursor-pointer"
                      onClick={() => handleSelectDoctor(doctor)}
                    >
                      {doctor?.user?.image ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-100">
                          <Image
                            src={doctor?.user?.image}
                            alt={doctor?.user?.name || "Doctor name"}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-8 h-8 text-blue-600" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold truncate">
                          Dr. {doctor?.user?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {doctor.specialization}
                        </p>
                      </div>

                      <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border rounded-lg bg-card shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {selectedDoctor?.user?.image ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-default-100 shadow">
                        <Image
                          src={selectedDoctor?.user?.image}
                          alt={`${selectedDoctor?.user?.name}  `}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shadow">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                    )}

                    <div className="w-full flex-col sm:flex-row justify-between">
                      <div className="  ">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">
                            Dr. {selectedDoctor?.user?.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className="border-blue-200 text-blue-600"
                          >
                            Selected
                          </Badge>
                        </div>

                        <div className="text-sm text-muted-foreground mt-1">
                          {selectedDoctor.specialization}
                        </div>

                        <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                          {selectedDoctor.hospital && (
                            <div className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              <span>{selectedDoctor.hospital}</span>
                            </div>
                          )}
                          {/* {selectedDoctor.experience && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            <span>
                              {selectedDoctor.experience} years experience
                            </span>
                          </div>
                        )} */}
                        </div>
                      </div>

                      <Button
                        variant="soft"
                        size="sm"
                        color="destructive"
                        onClick={() => setSelectedDoctor(null)}
                        className="text-blue-600 hover:text-blue-800 mt-1"
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                </div>
              )
            ) : hasActiveFilters ? (
              <div className="text-center py-8 text-muted-foreground">
                No doctors found matching your criteria
              </div>
            ) : null}
          </div>

          {/* Membership Form Fields */}
          {selectedDoctor && (
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium">Membership Details</h3>

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="fee"
                label="Visited Fee"
                control={form.control}
                placeholder="0"
                type="number"
                required
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="maxAppointments"
                label="Max Appointments"
                control={form.control}
                placeholder="0"
                type="number"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="discount"
                label="Discount Reports"
                control={form.control}
                placeholder="0"
                type="number"
              />

              <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                name="isActive"
                label="Available for appointments"
                control={form.control}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToList}
                  disabled={isPending} // Use isPending for loading state
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {" "}
                  {/* Use isPending for loading state */}
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Doctor
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
