"use client";

import { createPastAppointment } from "@/action/action.pastAppointment";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { NotFound } from "@/components/not-found";
import { User } from "@/components/svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useFetchOptions } from "@/hooks/useFetchCities";
import { PatientWithRelations } from "@/types"; // 👈 your patient type
import { medicalHistoryCreateSchema } from "@/zod-validation/medical-history";
import { passAppointmentCreateSchema } from "@/zod-validation/pastAppointment";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ChevronRightIcon, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

interface AddMedicalRecordsProps {
  handleBackToList: () => void;
  patientId: string;
}

type FormValues = z.infer<typeof medicalHistoryCreateSchema> & {
  search: string;
  city: string;
  gender: string;
};

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function AddPastAppointment({
  handleBackToList,
}: AddMedicalRecordsProps) {
  const user = useSession(); // logged-in doctor
  const [selectedDoctor, setSelectedDoctor] =
    useState<PatientWithRelations | null>(null);
  const { options: cities, loading: citiesLoading } =
    useFetchOptions("/api/cities");
  const [doctors, setDoctors] = useState<PatientWithRelations[]>([]);
  const [isFetchingDoctors, setIsFetchingDoctors] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(passAppointmentCreateSchema),
    defaultValues: {
      doctorId: selectedDoctor?.id || "",
      patientId: user?.data?.user?.id || "",
      search: "",
      city: "",
      gender: "",
    },
  });

  const watchedValues = useWatch({ control: form.control });
  const debouncedSearch = useDebounce(watchedValues.search, 500);
  const debouncedCity = useDebounce(watchedValues.city, 300);
  const debouncedGender = useDebounce(watchedValues.gender, 300);

  const handleSelectDoctor = (doctor: PatientWithRelations) => {
    setSelectedDoctor(doctor);
    form.setValue("doctorId", doctor.id);
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsFetchingDoctors(true);
        const params = new URLSearchParams();
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (debouncedCity) params.set("city", debouncedCity);
        if (debouncedGender) params.set("gender", debouncedGender);

        if (params.toString()) {
          const res = await fetch(`/api/doctors?${params.toString()}`);
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
  }, [debouncedSearch, debouncedCity, debouncedGender]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!selectedDoctor) {
      toast.error("Please select a doctor first");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createPastAppointment({
          ...data,
        });

        if (!result?.success) {
          toast.error(result?.errors?.[0]?.message || "Operation failed");
        } else {
          toast.success(result?.message);
          setSelectedDoctor(null);
          form.reset();
          handleBackToList();
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to add medical record");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={handleBackToList}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">Add Medical Record</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient Filters */}
          <div className="bg-white p-4 rounded-lg shadow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="search"
              control={form.control}
              placeholder="Search patient by name/email"
              label="Search"
            />
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              name="city"
              control={form.control}
              placeholder="Select city"
              label="City"
              loading={citiesLoading}
              options={cities}
            />
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              name="gender"
              control={form.control}
              placeholder="Select gender"
              label="Gender"
              options={[
                { value: "", label: "All" },
                { value: "MALE", label: "Male" },
                { value: "FEMALE", label: "Female" },
                { value: "OTHER", label: "Other" },
              ]}
            />
          </div>

          {/* Patient Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">
              {debouncedSearch || debouncedCity || debouncedGender
                ? "Available doctors"
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
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleSelectDoctor(doctor)}
                    >
                      {doctor?.user?.image ? (
                        <Image
                          src={doctor?.user?.image}
                          alt={doctor?.user?.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">
                          {doctor?.user?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {doctor?.user?.email}
                        </p>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border rounded-lg bg-card shadow-sm">
                  <div className="flex items-start gap-4">
                    {selectedDoctor?.user?.image ? (
                      <Image
                        src={selectedDoctor?.user?.image || ""}
                        alt={selectedDoctor?.user?.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {selectedDoctor?.user?.name}
                        </h3>
                        <Badge variant="outline" className="text-blue-600">
                          Selected
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedDoctor?.user?.email}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDoctor(null)}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              )
            ) : (
              <NotFound title="No doctor found" />
            )}
          </div>

          {/* Record Form */}
          {selectedDoctor && doctors?.length > 0 && (
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToList}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
