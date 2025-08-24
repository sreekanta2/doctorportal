import { getPatientProfileById } from "@/config/patients/patients";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import PatientForm from "./components/patient-form";

export default async function PatientDashboardPage() {
  const user = await getCurrentUser();
  if (!user?.email) {
    return redirect("/sign-in");
  }

  const patient = await getPatientProfileById(user?.id);

  if (!patient) {
    return redirect("/not-found");
  }

  return (
    <div>
      <PatientForm patient={patient?.data} />
    </div>
  );
}
