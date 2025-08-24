"use client";

import { Building2, User } from "lucide-react";
import Link from "next/link";

const AccountTypeSelector = () => {
  const accountTypes = [
    {
      id: "patient",
      title: "Patient",
      description: "Individual seeking healthcare services",
      icon: <User className="w-5 h-5" />,
      href: "/auth/sign-up/patient",
    },

    {
      id: "clinic",
      title: "Clinic/Hospital",
      description: "Medical facility or organization",
      icon: <Building2 className="w-5 h-5" />,
      href: "/auth/sign-up/clinic",
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
            Create Your Account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Select your account type to get started
          </p>
        </div>

        {/* Account Type Cards */}
        <div className="space-y-3">
          {accountTypes.map((type) => (
            <Link
              key={type.id}
              href={type.href}
              className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 
              hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-150
              bg-white dark:bg-gray-800 hover:shadow-sm"
            >
              <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                {type.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {type.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {type.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeSelector;
