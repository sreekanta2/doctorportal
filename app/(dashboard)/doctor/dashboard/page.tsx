import Clinics from "./components/clinics";
import { clinics } from "./components/data";

import RecentPatients from "./components/patients-component";
import ReportsSnapshot from "./components/report";

const DashboardPageView = async () => {
  const patients: any = [];
  const appointments: any = [];
  return (
    <div className="  bg-card/50 backdrop-blur-lg shadow-md dark:bg-card/70   rounded-md">
      <div className="text-2xl font-medium text-default-800  border-b p-4">
        Analytics dashboard
      </div>

      <ReportsSnapshot />

      {/* clinic and appointments */}
      <div className=" flex flex-col md:flex-row gap-4 p-4">
        <Clinics clinics={clinics} />

        <RecentPatients patients={patients} />
      </div>
    </div>
  );
};

export default DashboardPageView;
