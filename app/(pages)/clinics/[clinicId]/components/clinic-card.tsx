"use client";
import { ArrowUpRight, Calendar, Map, MapPin, Phone } from "lucide-react";
import Link from "next/link";

interface ClinicProps {
  clinic: {
    id: string;
    name: string;
    price: number;
    address: string;
    schedule: {
      day: string;
      hours: string;
    }[];
    phone?: string;
    distance?: string;
  };
}

export default function ClinicCard({ clinic }: ClinicProps) {
  const openDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, "_blank");
  };
  return (
    <article
      key={clinic.id}
      className="relative overflow-hidden rounded-xl     bg-card  border hover:shadow-md transition-all duration-300"
      itemScope
      itemType="https://schema.org/MedicalClinic"
    >
      <div className="p-4">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Clinic Info */}
          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2
                  className="text-2xl font-bold text-default-900 dark:text-white"
                  itemProp="name"
                >
                  {clinic.name}
                </h2>
              </div>

              <div
                className="flex items-start text-default-700 dark:text-default-300"
                itemProp="address"
                itemScope
                itemType="https://schema.org/PostalAddress"
              >
                <MapPin className="w-5 h-5 mt-0.5 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span
                  className="flex-1 text-default-600"
                  itemProp="streetAddress"
                >
                  {clinic.address}
                </span>
              </div>

              {clinic.phone && (
                <div className="flex items-center text-default-600">
                  <Phone className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <a
                    href={`tel:${clinic.phone.replace(/\D/g, "")}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    itemProp="telephone"
                  >
                    {clinic.phone}
                  </a>
                </div>
              )}
            </div>

            {/* Schedule */}
            <div>
              <h3 className="text-sm font-semibold text-default-500 dark:text-default-400 uppercase tracking-wider mb-3">
                Operating Hours
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {clinic.schedule.map((slot, idx) => (
                  <div
                    key={idx}
                    className="border border-default-100 dark:border-default-400 p-3 rounded-lg bg-muted hover:bg-default-100 dark:hover:bg-default-700/50 transition-colors"
                    itemProp="openingHoursSpecification"
                    itemScope
                    itemType="https://schema.org/OpeningHoursSpecification"
                  >
                    <h4
                      className="font-medium text-default-900  "
                      itemProp="dayOfWeek"
                    >
                      {slot.day}
                    </h4>
                    <p
                      className="text-default-600 dark:text-default-400"
                      itemProp="opens closes"
                    >
                      {slot.hours}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col justify-between lg:w-56">
            <div className="space-y-4">
              {clinic.distance && (
                <div className="flex items-center text-sm text-default-500 dark:text-default-400 bg-default-50 dark:bg-default-700/30 px-3 py-2 rounded-lg">
                  <Map className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span>{clinic.distance} away</span>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-3 pt-4">
              <Link
                href="#appointment-form"
                className="w-full px-6 py-3 bg-primary hover:bg-primary-700 text-white rounded-lg transition-all flex items-center justify-center font-medium shadow-sm hover:shadow-md"
                aria-label={`Book appointment at ${clinic.name}`}
              >
                <Calendar className="w-5 h-5 mr-2 flex-shrink-0" />
                Book Appointment
              </Link>
              <button
                className="w-full px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all flex items-center justify-center font-medium shadow-sm hover:shadow-md"
                onClick={() => openDirections(clinic.address)}
                aria-label={`Get directions to ${clinic.name}`}
              >
                <ArrowUpRight className="w-5 h-5 mr-2 flex-shrink-0" />
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
