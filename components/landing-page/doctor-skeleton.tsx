export const DoctorCardSkeleton = () => (
  <div className="group h-full bg-card rounded-xl shadow-md border p-4 space-y-4 animate-pulse">
    {/* Image Skeleton */}
    <div className="relative">
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      <div className="absolute top-4 right-4 w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
    </div>

    {/* Doctor Info Skeleton */}
    <div className="mb-4">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-1" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
    </div>

    {/* Location and Rating Skeleton */}
    <div className="flex flex-col gap-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="flex items-center gap-2">
        <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
      </div>
    </div>

    {/* Buttons Skeleton */}
    <div className="mt-auto pt-4 border-t border-default-100 dark:border-default-700">
      <div className="pt-2 flex gap-2 sm:gap-8 justify-between items-center">
        <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  </div>
);
