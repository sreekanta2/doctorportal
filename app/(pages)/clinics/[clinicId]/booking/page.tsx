"use client";
import { Hero } from "@/components/hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PatientForm } from "./components/patient-form";

const doctor = {
  id: "doc-101",
  name: "Dr. Sarah Johnson",
  specialty: "Cardiology",
  image: "/images/doctor-profile/doctor-06.jpg",
  rating: 4.9,
  reviews: 128,
  consultationFee: 120,
  clinic: "City Medical Center",
  address: "123 Healthcare Ave, Downtown",
  availability: ["Monday", "Wednesday", "Friday"],
};

export default function DoctorBookingPage() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  return (
    <div className="  bg-background">
      <Hero
        title={<span className="text-primary"> Booking</span>}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Clinics", href: "/clinics" },
          { label: "Matriseba", href: "/clinics/1" },
          { label: doctor.name },
        ]}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Details Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Profile Card */}
            <div className="bg-card rounded-lg shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="relative h-32 w-32 rounded-lg overflow-hidden">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold">{doctor.name}</h1>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      Verified
                    </span>
                  </div>

                  <p className="text-lg text-primary-600 ">
                    {doctor.specialty}
                  </p>

                  <h2
                    className="text-lg font-medium text-primary-600"
                    itemProp="affiliation"
                  >
                    Dinajpur Medical College
                  </h2>

                  {/* <div className="flex items-center gap-2 text-default-600">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {doctor.clinic} • {doctor.address}
                    </span>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Booking Section */}
            <div className="bg-card rounded-lg shadow-sm border p-4 space-y-6">
              <h2 className="text-xl font-semibold mb-6">
                Book Your Appointment
              </h2>

              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" />
              </div>

              <PatientForm />
            </div>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg shadow-sm border p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">
                Appointment Summary
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-lg overflow-hidden">
                      <Image
                        src={doctor.image}
                        alt={doctor.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">{doctor.name}</h4>
                    <p className="text-sm text-default-600">
                      {doctor.specialty}
                    </p>
                  </div>
                </div>

                {selectedDate && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-default-600">Date:</span>
                      <span className="font-medium">
                        {new Date(selectedDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-default-600">Consultation Fee:</span>
                    <span className="font-medium">
                      ${doctor.consultationFee}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-medium">Total:</span>
                    <span className="font-semibold">
                      ${doctor.consultationFee}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full mt-4"
                  size="lg"
                  disabled={!selectedDate}
                >
                  Confirm Booking
                </Button>

                <div className="mt-4 text-sm text-default-500">
                  <p>By booking, you agree to our cancellation policy:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Free cancellation up to 24 hours before</li>
                    <li>50% fee for late cancellations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
