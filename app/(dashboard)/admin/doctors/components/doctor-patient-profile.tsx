// "use client";

// import { StatCard } from "@/components/start-card";
// import profileImage from "@/public/images/doctor-profile/doctor-20.jpg";
// import { ImageViewerState } from "@/types/patient";
// import {
//   ActivityIcon,
//   ArrowLeft,
//   DropletIcon,
//   ScaleIcon,
//   UserIcon,
// } from "lucide-react";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// import { PastAppointmentCard } from "../../../patient/dashboard/components/past-appointment-card";

// interface PatientProfileProps {
//   handleBackToList?: () => void;
// }

// export const PatientProfile = ({ handleBackToList }: PatientProfileProps) => {
//   const [viewerState, setViewerState] = useState<ImageViewerState>({
//     isOpen: false,
//     images: [],
//     currentIndex: 0,
//     type: "",
//     appointmentId: "",
//   });

//   const [zoomLevel, setZoomLevel] = useState(1);

//   const openImageViewer = (
//     images: string[],
//     type: "prescription" | "report",
//     appointmentId: string
//   ) => {
//     setViewerState({
//       isOpen: true,
//       images,
//       currentIndex: 0,
//       type,
//       appointmentId,
//     });
//     setZoomLevel(1);
//   };

//   const closeImageViewer = () => {
//     setViewerState({
//       isOpen: false,
//       images: [],
//       currentIndex: 0,
//       type: "",
//       appointmentId: "",
//     });
//   };

//   const nextImage = () => {
//     setViewerState((prev) => ({
//       ...prev,
//       currentIndex: (prev.currentIndex + 1) % prev.images.length,
//     }));
//     setZoomLevel(1);
//   };

//   const prevImage = () => {
//     setViewerState((prev) => ({
//       ...prev,
//       currentIndex:
//         (prev.currentIndex - 1 + prev.images.length) % prev.images.length,
//     }));
//     setZoomLevel(1);
//   };

//   const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 3));
//   const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));

//   useEffect(() => {
//     if (!viewerState.isOpen) return;

//     const handleKeyDown = (e: KeyboardEvent) => {
//       switch (e.key) {
//         case "ArrowRight":
//           nextImage();
//           break;
//         case "ArrowLeft":
//           prevImage();
//           break;
//         case "+":
//           zoomIn();
//           break;
//         case "-":
//           zoomOut();
//           break;
//         case "Escape":
//           closeImageViewer();
//           break;
//         default:
//           break;
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [viewerState.isOpen]);

//   return (
//     <div className="min-h-screen relative">
//       <div className="flex items-center gap-4 mb-4">
//         <button onClick={handleBackToList}>
//           <ArrowLeft className="w-6 h-6 text-default-500 dark:text-default-400 hover:text-default-700 dark:hover:text-default-300 transition-colors" />
//         </button>
//       </div>

//       {/* Patient Header */}
//       <div className="flex flex-col md:flex-row gap-6 mb-8">
//         <div className="flex items-start gap-4">
//           <div className="w-24 h-24 rounded-full border-4 border-white dark:border-default-800 shadow-md overflow-hidden">
//             <Image
//               src={profileImage}
//               alt={"patient name"}
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-default-800 dark:text-white">
//               Patient name
//             </h1>
//             <div className="flex flex-wrap gap-2 mt-2">
//               <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
//                 ID: patientId
//               </span>
//               <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
//                 Blood Group N/A
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1">
//           <StatCard
//             icon={<UserIcon className="w-5 h-5" />}
//             label="Age/Gender"
//             value={`${15} / ${"male"}`}
//             className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10"
//           />
//           <StatCard
//             icon={<ScaleIcon className="w-5 h-5" />}
//             label="Weight"
//             value={`${50} kg`}
//             className="text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/10"
//           />
//           <StatCard
//             icon={<DropletIcon className="w-5 h-5" />}
//             label="Last BP"
//             value={"120/80 mmHg"}
//             className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10"
//           />
//           <StatCard
//             icon={<ActivityIcon className="w-5 h-5" />}
//             label="Allergies"
//             value={"None"}
//             className="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10"
//           />
//         </div>
//       </div>

//       {/* Upcoming Appointments */}
//       <div className="mb-10">
//         <h2 className="text-xl font-semibold mb-4 text-default-800 ">
//           Upcoming Appointments
//         </h2>
//         <div className="    rounded-lg shadow overflow-hidden">
//           <UpcomingAppointmentCard key={1} />
//         </div>
//       </div>

//       {/* Past Appointments */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4 text-default-800 dark:text-white">
//           Past Appointments
//         </h2>

//         <div className="space-y-4">
//           <PastAppointmentCard />
//         </div>
//       </div>
//     </div>
//   );
// };
