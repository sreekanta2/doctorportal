"use client";

import { Gender } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { mapSpecializationsToOptions } from "@/lib/utils/utils";
import CustomFormField, { FormFieldType } from "./custom-form-field";
import { Form } from "./ui/form";

// Schema definition for filtering form
const formSchema = z.object({
  search: z.string().optional(),
  specialization: z.string().optional(),
  city: z.string().optional(),
  gender: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const DoctorFilterForm = () => {
  const [specialties, setSpecialties] = useState([]);
  const [cities, setCities] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  const form = useForm<FormData>({
    defaultValues: {
      search: searchParams.get("search") || "",
      specialization: searchParams.get("specialization") || "",
      city: searchParams.get("city") || "",
      gender: searchParams.get("gender") || "",
    },
  });

  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams();

    // Only set the current watched values (replaces all previous filters)
    for (const key in watchedValues) {
      const value = watchedValues[key as keyof FormData];
      if (value) {
        params.set(key, value);
      }
    }

    const newUrl = `${currentUrl.pathname}?${params.toString()}`;
    router.push(newUrl);
  }, [watchedValues, router]);

  useEffect(() => {
    let isMounted = true; // prevent state update after unmount

    const fetchData = async () => {
      try {
        const [specialtiesRes, citiesRes] = await Promise.all([
          fetch("/api/specialties"),
          fetch("/api/cities"),
        ]);

        const specialtiesData = await specialtiesRes.json();
        const citiesData = await citiesRes.json();

        if (isMounted) {
          setSpecialties(specialtiesData?.data?.data || []);
          setCities(citiesData?.data?.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // cleanup
    };
  }, []);

  const mappedSpecialties = mapSpecializationsToOptions(specialties);
  const mappedCities = cities.map((city: { id: string; name: string }) => ({
    value: city.name.toLowerCase(),
    label: city.name,
  }));
  return (
    <Form {...form}>
      <form className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          name="search"
          control={form.control}
          placeholder="Search by name"
          className="w-full"
          label="Search"
        />

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          name="specialization"
          control={form.control}
          placeholder="Select Specialization"
          className="w-full"
          label="Specialty"
          options={mappedSpecialties}
        />

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          name="city"
          control={form.control}
          placeholder="Select Location"
          className="w-full"
          label="City"
          options={mappedCities}
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
      </form>
    </Form>
  );
};

export default DoctorFilterForm;
