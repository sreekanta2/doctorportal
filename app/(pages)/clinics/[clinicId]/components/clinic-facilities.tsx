"use client";
import { Check } from "lucide-react";

export default function ClinicFacilities({
  facilities,
}: {
  facilities: string[];
}) {
  return (
    <div className="bg-card/70 rounded-xl shadow-sm p-6  ">
      <h3 className="text-lg font-semibold text-default-900 mb-4">
        Facilities & Services
      </h3>
      <div className="space-y-2">
        {facilities.map((facility, index) => (
          <div key={index} className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-default-700">{facility}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
