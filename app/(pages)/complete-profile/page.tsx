"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useEffect } from "react";

const SelectRolePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if already has a role
  useEffect(() => {
    if (status === "authenticated" && session.user.role) {
      router.push(session.user.role === "clinic" ? "/clinic" : "/patient");
    }
  }, [session, status, router]);

  const handleRoleSelect = async (role: "patient" | "clinic") => {
    try {
      const response = await fetch("/api/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        router.push(role === "clinic" ? "/clinic" : "/patient");
      } else {
        console.error("Failed to set role");
      }
    } catch (error) {
      console.error("Error setting role:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Select Your Role
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Please choose how you'd like to use our platform
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelect("patient")}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
          >
            I'm a Patient
          </button>

          <button
            onClick={() => handleRoleSelect("clinic")}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition duration-200"
          >
            I'm a Clinic/Doctor
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectRolePage;
