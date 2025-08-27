import { NotFound } from "@/components/not-found";
import { getClinicProfileByEmail } from "@/config/clinic/clinic";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import DoctorProfileForm from "./profile-form";

export default async function ClinicPage() {
  const user = await getCurrentUser();
  if (!user?.email) {
    return redirect("/sign-in");
  }

  const clinic = await getClinicProfileByEmail(user?.email);

  if (!clinic?.success) {
    return <NotFound title="Clinic not found" />;
  }
  const clinicWithUser = clinic?.data;

  return <DoctorProfileForm clinic={clinicWithUser} />;
}
