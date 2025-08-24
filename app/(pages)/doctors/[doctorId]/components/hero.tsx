"use client";

import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const DoctorHero = ({ doctorId }: { doctorId: string }) => {
  const formSchema = z.object({
    location: z.string().optional(),
    category: z.string().nonempty("Employment type is required"),
  });
  type FormData = z.infer<typeof formSchema>;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      category: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    // handle form submission
    // make API request to search for doctors
  };
  const employmentType = [
    { id: 1, label: "Full Time" },
    { id: 2, label: "Part Time" },
  ];

  return (
    <section
      className="bg-[url(https://dashboi-one.vercel.app/images/home/hero-bg.png)]  bg-cover bg-no-repeat relative mb-8"
      id="home"
    >
      <div className="bg-gradient-to-b from-primary/30   dark:from-primary/20 dark:to-[#0F172A] ">
        <div className="container">
          <div className=" relative z-10">
            <div className=" w-full pt-32 md:pt-32 pb-10  flex items-center justify-center   ">
              <div className=" flex justify-center flex-col items-center">
                <h1 className="max-w-[600px] text-xl md:text-2xl xl:text-4xl xl:leading-[52px] font-semibold text-default-900 ">
                  <span className="text-primary"> Doctor</span>
                </h1>
                <Breadcrumbs>
                  <BreadcrumbItem>
                    <Link href="/">Home</Link>
                  </BreadcrumbItem>

                  <BreadcrumbItem>
                    <Link href="/doctors">Doctors</Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem>{doctorId}</BreadcrumbItem>
                </Breadcrumbs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorHero;
