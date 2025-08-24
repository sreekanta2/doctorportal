export default function page() {
  return <div>page</div>;
}

// "use client"; // Mark this component as a client component

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useState } from "react";

// const SettingsPage = () => {
//   // State for form inputs and toggles
//   const [name, setName] = useState("Dr. John Doe");
//   const [email, setEmail] = useState("johndoe@example.com");
//   const [profilePicture, setProfilePicture] = useState(
//     "/images/doctor-profile/doctor-18.jpg"
//   );
//   const [notifications, setNotifications] = useState({
//     email: true,
//     sms: false,
//     push: true,
//   });
//   const [twoFactorAuth, setTwoFactorAuth] = useState(true);

//   return (
//     <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold text-default-900 mb-8">Settings</h1>

//         {/* User Profile Section */}
//         <div className="bg-card shadow rounded-lg p-6 mb-8">
//           <h2 className="text-xl font-semibold text-default-700 mb-4">
//             Profile Information
//           </h2>
//           <div className="flex flex-col md:flex-row md:items-center gap-6">
//             <div className="relative w-fit">
//               <img
//                 src={profilePicture}
//                 alt="Profile"
//                 className="w-24 h-24 rounded-full object-cover"
//               />
//               <label
//                 htmlFor="profile-picture"
//                 className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </label>
//               <input type="file" id="profile-picture" className="hidden" />
//             </div>
//             <div className="flex-1">
//               <label className="block text-base font-medium text-default-700">
//                 Name
//               </label>
//               <Input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="mt-1 block w-full rounded-md border-default-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"
//               />
//               <label className="block text-base font-medium text-default-700 mt-4">
//                 Email
//               </label>
//               <Input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="mt-1 block w-full rounded-md border-default-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base"
//               />
//             </div>
//           </div>
//           <Button
//             type="submit"
//             className="bg-primary-700 text-white mt-6  rounded-md hover:bg-primary-800   "
//           >
//             Save Changes
//           </Button>
//         </div>

//         {/* Notification Preferences */}
//         <div className="bg-card shadow rounded-lg p-6 mb-8">
//           <h2 className="text-xl font-semibold text-default-900 mb-4">
//             Notification Preferences
//           </h2>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-default-700">Email Notifications</span>
//               <button
//                 onClick={() =>
//                   setNotifications({
//                     ...notifications,
//                     email: !notifications.email,
//                   })
//                 }
//                 className={`${
//                   notifications.email ? "bg-blue-500" : "bg-default-300"
//                 } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
//               >
//                 <span
//                   className={`${
//                     notifications.email ? "translate-x-6" : "translate-x-1"
//                   } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
//                 />
//               </button>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-default-700">SMS Notifications</span>
//               <button
//                 onClick={() =>
//                   setNotifications({
//                     ...notifications,
//                     sms: !notifications.sms,
//                   })
//                 }
//                 className={`${
//                   notifications.sms ? "bg-blue-500" : "bg-default-300"
//                 } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
//               >
//                 <span
//                   className={`${
//                     notifications.sms ? "translate-x-6" : "translate-x-1"
//                   } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
//                 />
//               </button>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-default-700">Push Notifications</span>
//               <button
//                 onClick={() =>
//                   setNotifications({
//                     ...notifications,
//                     push: !notifications.push,
//                   })
//                 }
//                 className={`${
//                   notifications.push ? "bg-blue-500" : "bg-default-300"
//                 } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
//               >
//                 <span
//                   className={`${
//                     notifications.push ? "translate-x-6" : "translate-x-1"
//                   } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
//                 />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Security Settings */}
//         <div className="bg-card shadow rounded-lg p-6">
//           <h2 className="text-xl font-semibold text-default-900 mb-4">
//             Security Settings
//           </h2>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-default-700">
//                 Two-Factor Authentication
//               </span>
//               <button
//                 onClick={() => setTwoFactorAuth(!twoFactorAuth)}
//                 className={`${
//                   twoFactorAuth ? "bg-blue-500" : "bg-default-300"
//                 } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
//               >
//                 <span
//                   className={`${
//                     twoFactorAuth ? "translate-x-6" : "translate-x-1"
//                   } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
//                 />
//               </button>
//             </div>
//             <button className="text-blue-500 hover:text-blue-700">
//               View Active Sessions
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;
