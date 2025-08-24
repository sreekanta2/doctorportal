"use client";

import { cn } from "@/lib/utils";

const ReportsSnapshot = () => {
  const reportItems = [
    {
      value: "all",
      text: "All Patients",
      total: "10,234",
      color: "primary",
    },
    {
      value: "event",
      text: "Event Count",
      total: "536",
      color: "warning",
    },
    {
      value: "conversation",
      text: "Conversations",
      total: "21",
      color: "success",
    },
    {
      value: "revenue",
      text: "Total Amounts",
      total: "3,321",
      color: "info",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 p-4">
      {reportItems.map((item, index) => (
        <div
          key={`report-item-${index}`}
          className={cn("relative p-4 rounded-lg overflow-hidden", {
            "bg-blue-50 dark:bg-blue-900/30": item.color === "primary",
            "bg-orange-50 dark:bg-orange-900/30": item.color === "warning",
            "bg-green-50 dark:bg-green-900/30": item.color === "success",
            "bg-cyan-50 dark:bg-cyan-900/30": item.color === "info",
          })}
        >
          {/* Decorative circle */}
          <div
            className={cn("absolute w-10 h-10 rounded-full -top-3 -right-3", {
              "bg-blue-200/70 dark:bg-blue-700": item.color === "primary",
              "bg-orange-200/70 dark:bg-orange-700": item.color === "warning",
              "bg-green-200/70 dark:bg-green-700": item.color === "success",
              "bg-cyan-200/70 dark:bg-cyan-700": item.color === "info",
            })}
          ></div>

          {/* Content */}
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 relative z-10">
            {item.text}
          </h3>
          <p
            className={cn("text-lg font-semibold mt-1", {
              "text-blue-600 dark:text-blue-400": item.color === "primary",
              "text-orange-600 dark:text-orange-400": item.color === "warning",
              "text-green-600 dark:text-green-400": item.color === "success",
              "text-cyan-600 dark:text-cyan-400": item.color === "info",
            })}
          >
            {item.total}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReportsSnapshot;
