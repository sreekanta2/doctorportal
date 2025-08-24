import { getClinicProfileById } from "@/config/clinic/clinic";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import DoctorProfileForm from "./profile-form";

export default async function ClinicPage() {
  const user = await getCurrentUser();
  if (!user?.email) {
    return redirect("/sign-in");
  }

  const clinic = await getClinicProfileById(user?.id);

  if (!clinic) {
    return redirect("/not-found");
  }

  return <DoctorProfileForm clinic={clinic?.data} />;
}
