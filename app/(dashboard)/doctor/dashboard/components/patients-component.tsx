"use client";
import Link from "next/link";
import { useState } from "react";
import PatientCard from "../../_components/patients-card";

const RecentPatients = ({ patients = [] }: { patients: any }) => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
  };
  return (
    <div className=" w-full">
      <div className="border  bg-card rounded-md space-y-2">
        <h1 className="text-lg md:text-xl font-medium     bg-card/50 text-default-700   border-b p-4">
          Recents Patients
        </h1>

        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1  gap-4 p-4">
          {[1, 2, 3, 4, 5].map((patient: any) => (
            <PatientCard key={patient} />
          ))}
        </div>

        <Link
          href="/doctor/patients"
          className=" text-default-700 text-base hover:text-blue-400  text-center pb-4  flex justify-center  "
        >
          View All
        </Link>
      </div>
    </div>
  );
};

export default RecentPatients;
