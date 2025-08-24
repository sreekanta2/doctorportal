import DoctorProfileForm from "./profile-form";

export default async function DoctorProfilePage() {
  // const doctor = await getDoctor("1", 1, 5);
  const doctor: any = [];
  // if (!doctor) {
  //   return <div>Doctor not found</div>;
  // }
  return (
    <main>
      <DoctorProfileForm />
    </main>
  );
}
