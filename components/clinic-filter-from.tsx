"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { BANGLADESH_DISTRICTS } from "@/lib/utils/utils";
import CustomFormField, { FormFieldType } from "./custom-form-field";
import { Form } from "./ui/form";

// Schema definition for filtering form
const formSchema = z.object({
  search: z.string().optional(),
  city: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const ClinicFilterForm = () => {
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
  return (
    <Form {...form}>
      <form className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          name="search"
          control={form.control}
          placeholder="Search by name, email"
          className="w-full"
          label="Search"
        />

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          name="city"
          control={form.control}
          placeholder="Select Location"
          className="w-full"
          label="Location"
          options={BANGLADESH_DISTRICTS}
        />
      </form>
    </Form>
  );
};

export default ClinicFilterForm;
