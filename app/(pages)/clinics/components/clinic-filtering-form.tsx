"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Form } from "@/components/ui/form";

// Schema definition for filtering form
const formSchema = z.object({
  search: z.string().optional(),
  city: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const ClinicFilterForm = () => {
  const [cities, setCities] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  const form = useForm<FormData>({
    defaultValues: {
      search: searchParams.get("search") || "",
      city: searchParams.get("city") || "",
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
        const fetchCities = async () => {
          const response = await fetch("/api/cities");
          const data = await response.json();

          return data?.data?.data || [];
        };
        fetchCities().then((citiesData) => {
          if (isMounted) {
            setCities(citiesData || []);
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

  const mappedCities = cities?.map((city: { id: string; name: string }) => ({
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
          name="city"
          control={form.control}
          placeholder="Select City"
          className="w-full"
          label="City"
          options={mappedCities}
        />
      </form>
    </Form>
  );
};

export default ClinicFilterForm;
