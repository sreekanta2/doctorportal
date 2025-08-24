"use client";

import { Plus } from "lucide-react";

import { PastAppointmentCard } from "@/app/(dashboard)/patient/dashboard/components/past-appointment-card";
import { MedicalHistoryWithRelations } from "@/types";
import { PaginationMeta } from "@/types/common";
import { useState } from "react";
import { AddPastAppointment } from "./add-pastAppointment";

export default function DoctorPageView({
  medicalHistory,
  pagination,
}: {
  medicalHistory: MedicalHistoryWithRelations[];
  pagination: PaginationMeta;
}) {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateDoctor = () => {
    setIsCreating(true);
  };

  const handleBackToList = () => {
    setIsCreating(false);
  };
  return (
    <div className="w-full bg-card/50 p-4 rounded-lg shadow-md">
      {/* View Selection */}
      {!isCreating ? (
        <div>
          <header className="mb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-2xl font-medium text-default-900 dark:text-white">
                My Visited Doctors
              </h1>
              <button
                onClick={handleCreateDoctor}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus size={18} />
                Add Visited Doctor
              </button>
            </div>
            <hr className="my-3 border-default-200 dark:border-default-700" />
          </header>

          <div>
            {medicalHistory?.length > 0 ? (
              medicalHistory.map((record) => (
                <PastAppointmentCard key={record.id} medicalRecords={record} />
              ))
            ) : (
              <p>No medical history found.</p>
            )}
          </div>
        </div>
      ) : (
        <AddPastAppointment
          handleBackToList={handleBackToList}
          patientId={medicalHistory[0]?.patientId}
        />
      )}
    </div>
  );
}
