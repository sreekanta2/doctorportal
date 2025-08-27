import { BadgeCheck, GraduationCap, Stethoscope, User } from "lucide-react";

const DoctorCardSkeleton = () => {
  return (
    <article className="border bg-white rounded-xl shadow-sm overflow-hidden animate-pulse dark:bg-gray-900 dark:border-gray-800">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Doctor Image Skeleton */}
          <div className="relative h-28 w-28 min-w-[112px] rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <User className="text-gray-400 dark:text-gray-600" />
            </div>
          </div>

          {/* Doctor Info Skeleton */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              <BadgeCheck className="w-5 h-5 text-gray-300 dark:text-gray-600" />
            </div>

            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-gray-300 dark:text-gray-600" />
              <div className="h-5 w-56 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>

            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-gray-300 dark:text-gray-600" />
              <div className="h-5 w-60 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>

            <div className="pt-2 flex gap-3">
              <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="border-t px-5 py-3 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center flex-wrap gap-3">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-sm"
                  ></div>
                ))}
              </div>
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default DoctorCardSkeleton;
