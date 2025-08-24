"use client";
import CustomImage from "@/components/ImageComponent";
import { Badge } from "@/components/ui/badge";
import { avatar } from "@/config/site";
import { CakeIcon, DropletIcon, ScaleIcon, UserIcon } from "lucide-react";

export default function PatientCard() {
  const patient: any = [];
  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all p-4  ">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Patient Image */}
        <div className="flex flex-col items-center sm:items-start gap-3">
          <CustomImage
            src={patient?.image || avatar}
            alt={patient?.name || ""}
            aspectRatio="1/1"
            containerClass="w-20 h-20 sm:w-24 sm:h-24"
            className="rounded-lg border border-gray-100 dark:border-gray-700"
          />
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              ID: {patient?.id || "N/A"}
            </Badge>
            <Badge
              variant="soft"
              color="success"
              className="text-xs px-2 py-0.5 capitalize"
            >
              {patient?.status || "Active"}
            </Badge>
          </div>
        </div>

        {/* Patient Details */}
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {patient?.name || "Patient Name"}
          </h1>

          {/* Patient Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-900/20">
                <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Gender
                </p>
                <p className="text-base font-medium text-gray-800 dark:text-gray-200 capitalize">
                  {patient?.gender || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-orange-50 dark:bg-orange-900/20">
                <CakeIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Age</p>
                <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                  {patient?.age || "N/A"} Years
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-green-50 dark:bg-green-900/20">
                <DropletIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Blood Group
                </p>
                <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                  {patient?.bloodGroup || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-purple-50 dark:bg-purple-900/20">
                <ScaleIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Weight
                </p>
                <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                  {patient?.weight || "N/A"} kg
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
