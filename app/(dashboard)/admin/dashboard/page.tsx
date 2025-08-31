import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import AdminStats from "./components/admin-state";
import DoctorList from "./components/doctor-list";

import { getAllAdminClinics, getAllAdminDoctors } from "@/config/admin";
import { getAllPatients } from "@/config/patients/patients";
import {
  ClinicWithRelations,
  DoctorWithRelations,
  PatientWithRelations,
} from "@/types";
import ClinicsList from "./components/clinics-list";
import PatientsList from "./components/patients-list";

export default async function AdminDashboardPage() {
  const result = await getAllAdminDoctors({ page: "1", limit: "5" });

  const doctors: DoctorWithRelations[] = result?.data || [];
  const totalDoctors = result?.meta?.pagination?.total || 0;
  const patientResults = await getAllPatients({ page: "1", limit: "5" });

  const patients: PatientWithRelations[] = patientResults?.data || [];
  const totalPatients: number = patientResults?.meta?.pagination?.total || [];

  const clinicResults = await getAllAdminClinics({
    page: "1",
    limit: "5",
  });

  const totalClinics: number = clinicResults?.meta?.pagination?.total || [];

  const clinics: ClinicWithRelations[] = clinicResults.data;

  return (
    <div className="space-y-6">
      <div className="text-2xl font-medium text-default-800">
        <h1> Welcome Admin!</h1>
        <p className="text-base text-default-600">Dashboard</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AdminStats
              doctorsCount={totalDoctors || 0}
              totalPatient={totalPatients || 0}
              totalClinics={totalClinics || 0}
            />
          </div>
        </CardContent>
      </Card>

      <div className=" grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border p-4 bg-card rounded-md space-y-2">
          <h1 className="text-lg md:text-xl font-medium  bg-card  ">
            Recent Doctors
          </h1>
          <hr className="pb-4" />
          <ScrollArea className="pb-4">
            <DoctorList doctors={doctors} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {doctors?.length !== 0 && (
            <Link
              href="/admin/doctors"
              className=" text-default-600 hover:text-primary flex justify-center w-full"
            >
              View All
            </Link>
          )}
        </div>
        <div className="border p-4 bg-card rounded-md space-y-2">
          <h1 className="text-lg md:text-xl font-medium  bg-card  ">
            Recent Patients
          </h1>
          <hr className="pb-4" />
          <ScrollArea className="pb-4">
            <PatientsList patients={patients} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          {patients?.length !== 0 && (
            <Link
              href="/admin/patients"
              className=" text-default-600 hover:text-primary flex justify-center w-full"
            >
              View All
            </Link>
          )}
        </div>
      </div>
      <div className="border p-4 bg-card rounded-md space-y-2">
        <h1 className="text-lg md:text-xl font-medium  bg-card  ">
          Recent Clinics
        </h1>
        <hr className="pb-4" />
        <ScrollArea className="pb-4">
          <ClinicsList clinics={clinics} />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {patients?.length !== 0 && (
          <Link
            href="/admin/patients"
            className=" text-default-600 hover:text-primary flex justify-center w-full"
          >
            View All
          </Link>
        )}
      </div>
    </div>
  );
}
