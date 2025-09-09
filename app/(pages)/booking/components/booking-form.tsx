"use client";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Form } from "@/components/ui/form";
import { avatar } from "@/config/site";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
export const bookingForm = z.object({
  name: z.string().min(4, "Patient name are required"),
  phoneNumber: z.string().min(11, "Phone number are required"),
  date: z.date(),
  clinicId: z.string(),
  doctorId: z.string(),
});
type formType = z.infer<typeof bookingForm>;
const BookingForm = ({ doctor, clinic }: { doctor: any; clinic: any }) => {
  const form = useForm({
    resolver: zodResolver(bookingForm),
    defaultValues: {
      name: "",
      phoneNumber: "",
      date: new Date(),
      clinicId: clinic?.id,
      doctorId: doctor?.id,
    },
  });
  useEffect(() => {
    if (doctor || clinic) {
      form.reset({
        clinicId: clinic?.id,
        doctorId: doctor?.id,
      });
    }
  }, [doctor, clinic]);
  console.log(form.formState.errors);
  const onSubmit: SubmitHandler<formType> = (data) => {
    console.log("Booking data:", data);
    alert("Appointment booked successfully!");
  };

  // Sample doctor and clinic data - in a real app this would come from props or API

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book Your Appointment
          </h1>
          <p className="text-lg text-gray-600">
            Schedule your visit with our specialist
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Information Section */}
            <div className="md:w-2/5 bg-blue-50 p-8">
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Doctor Information
                </h2>
                <div className="flex items-center mb-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden mr-4">
                    <Image
                      src={doctor?.user?.image || avatar}
                      alt={doctor.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {doctor?.user?.name}
                    </h3>
                    <p className="text-blue-600">{doctor?.specialization}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Clinic Information
                </h2>
                <div className="mb-4 rounded-lg overflow-hidden">
                  <div className="relative h-40 w-full">
                    <Image
                      src={clinic?.user?.image || avatar}
                      alt={clinic?.user?.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <h3 className="font-bold text-gray-900">
                    {clinic?.user?.name}
                  </h3>
                  <p className="flex items-start">
                    <svg
                      className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {clinic?.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Form Section */}
            <div className="md:w-3/5 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Patient Information
              </h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    required
                    className="bg-white"
                    placeholder="Enter patient full name"
                  />
                  <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    control={form.control}
                    name="phoneNumber"
                    required
                    className="bg-white"
                    placeholder="+8801234567890"
                  />
                  <CustomFormField
                    fieldType={FormFieldType.DATE_PICKER}
                    control={form.control}
                    name="date"
                    required
                    className="bg-white"
                    placeholder="Appointment Date"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Confirm Booking
                  </button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
