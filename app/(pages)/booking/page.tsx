import { getClinicById, getDoctorById } from "@/config/user/uer-api.config";
import BookingForm from "./components/booking-form";

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const doctorId = searchParams?.doctorId as string;
  const clinicId = searchParams?.clinicId as string;
  const doctor = await getDoctorById(doctorId);
  const clinic = await getClinicById(clinicId);
  console.log(clinic);
  return (
    <div className="container py-8">
      <BookingForm doctor={doctor} clinic={clinic} />
    </div>
  );
}
