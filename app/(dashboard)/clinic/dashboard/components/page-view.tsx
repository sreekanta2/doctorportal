"use client";
import { NotFound } from "@/components/not-found";

import { Button } from "@/components/ui/button";

import { deleteMembership } from "@/action/action.membarsip";
import { deleteSchedule } from "@/action/action.schedules";
import {
  Building2,
  CalendarDays,
  Clock,
  Plus,
  Stethoscope,
  Trash,
} from "lucide-react";
import Image from "next/image";

import { User } from "@/components/svg";
import { MembershipWithRelations } from "@/types";
import { PaginationMeta } from "@/types/common";
import { Schedule } from "@prisma/client";
import { format } from "date-fns";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { AddDoctorMembership } from "./add-membership-form";
import { ScheduleModal } from "./schedule-modal";

export default function DoctorPageView({
  membershipDoctors,
}: {
  membershipDoctors: MembershipWithRelations[];
  pagination: PaginationMeta | undefined;
}) {
  const [isCreating, setIsCreating] = useState(false);

  const [isPadding, startTransition] = useTransition();
  const handleCreateDoctor = () => {
    setIsCreating(true);
  };
  const handleDeleteMembership = async (id: string) => {
    startTransition(async () => {
      try {
        const result = await deleteMembership(id);

        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result?.errors[0]?.message || "something went wrong");
        }
      } catch (error) {
        toast.error("Field delete membership");
      }
    });
  };
  const handleDeleteSchedule = async (scheduleId: string) => {
    startTransition(async () => {
      try {
        const result = await deleteSchedule(scheduleId);

        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result?.errors[0]?.message || "something went wrong");
        }
      } catch (error) {
        toast.error("Field delete membership");
      }
    });
  };

  const handleBackToList = () => {
    setIsCreating(false);
  };
  return (
    <div className="w-full bg-card/50 p-4 rounded-lg shadow-md">
      {/* View Selection */}
      {!isCreating ? (
        <div>
          <header className="mb-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-medium text-default-900 dark:text-white">
                All Doctors
              </h1>
              <button
                onClick={handleCreateDoctor}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus size={18} />
                Add Doctor
              </button>
            </div>
            <hr className="my-3 border-default-200 dark:border-default-700" />
          </header>

          <div>
            {membershipDoctors?.length > 0 ? (
              <div className="space-y-4">
                {membershipDoctors?.map((member) => (
                  <article
                    key={member.id}
                    className="w-full bg-card border rounded-xl hover:shadow-sm transition-all overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Doctor Image Section */}
                      <div className="relative sm:w-fit p-4 border-b sm:border-b-0 sm:border-r bg-default-50">
                        <div className="relative w-48 h-48 rounded-lg overflow-hidden ring-2 ring-default-500 ring-opacity-30 shadow-sm">
                          {member?.doctor?.user?.image ? (
                            <Image
                              src={member?.doctor?.user?.image || ""}
                              alt={member?.doctor?.user?.name || "Doctor Image"}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="flex items-center justify-center p-6 w-full h-full bg-gray-100">
                              <User className="  text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Doctor Details Section */}
                      <div className="flex-1 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                          <div>
                            <h2 className="text-xl font-bold text-default-900">
                              Dr.{" "}
                              {member?.doctor?.user?.name
                                ? member.doctor.user.name
                                    .charAt(0)
                                    .toUpperCase() +
                                  member.doctor.user.name.slice(1)
                                : ""}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="p-2 bg-blue-50 rounded-lg dark:bg-gray-800">
                                <Stethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="  font-semibold text-primary">
                                {member?.doctor?.specialization
                                  ? member?.doctor?.specialization
                                      .charAt(0)
                                      .toUpperCase() +
                                    member?.doctor?.specialization.slice(1)
                                  : ""}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="p-2 bg-blue-50 rounded-lg dark:bg-gray-800">
                                <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-base font-bold text-primary">
                                {member?.doctor?.hospital || "Medicine"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-medium text-primary">
                                Max Appointments:
                              </span>
                              <span className="text-base ">
                                {member?.maxAppointments || 0}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 ">
                                <span className="font-medium text-primary">
                                  New Patient :
                                </span>
                                <span className="text-base ">
                                  {member?.fee || 0}
                                </span>
                              </div>{" "}
                              {member?.fee && (
                                <div className="flex items-center gap-2 ">
                                  <span className="font-medium text-primary">
                                    Old Patient :
                                  </span>
                                  <span className="text-base ">
                                    {member?.fee - 100}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col  justify-center gap-4">
                            {/* add schedule modal */}
                            <ScheduleModal membershipId={member?.id} />
                            <button
                              className="text-base px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
                              onClick={() => handleDeleteMembership(member.id)}
                            >
                              Delete Membership
                            </button>
                          </div>
                        </div>

                        {/* Doctor Stats */}
                        <div className="flex flex-wrap w-full gap-3">
                          {member?.schedules?.map((schedule: Schedule) => (
                            <div
                              key={schedule.id}
                              aria-disabled={isPadding}
                              className={`flex p-3 text-sm border rounded-lg w-fit hover:bg-muted/50 transition-colors items-start ${
                                isPadding ?? "blur-lg"
                              }`}
                            >
                              {/* Schedule Information - Improved layout */}
                              <div className="   space-y-3 w-full">
                                <div className="flex items-center gap-2 min-w-[120px]">
                                  <div className=" bg-blue-50 rounded-lg dark:bg-gray-800">
                                    <CalendarDays className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <span>
                                    {String(schedule.startDay).substring(0, 3)}{" "}
                                    - {String(schedule.endDay).substring(0, 3)}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="p-2 bg-blue-50 rounded-lg dark:bg-gray-800">
                                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <span>
                                    {format(
                                      new Date(
                                        `1970-01-01T${schedule.startTime}`
                                      ),
                                      "hh:mm a"
                                    )}{" "}
                                    -{" "}
                                    {format(
                                      new Date(
                                        `1970-01-01T${schedule.endTime}`
                                      ),
                                      "hh:mm a"
                                    )}
                                  </span>
                                </div>
                              </div>

                              {/* Hover Actions - Fixed positioning */}
                              <div className="     transition-opacity flex gap-1   px-1 rounded">
                                <ScheduleModal
                                  membershipId={schedule?.membershipId}
                                  schedule={schedule}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive hover:text-destructive"
                                  onClick={() =>
                                    handleDeleteSchedule(schedule.id)
                                  }
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
                {/* {membershipDoctors.meta.pagitation >
                  membershipDoctors.pagination.limit && (
                  <Pagination
                    totalPages={membershipDoctors.pagination.totalPages}
                    currentPage={membershipDoctors.pagination.currentPage}
                  />
                )} */}
              </div>
            ) : (
              <div>
                <NotFound
                  title="Your clinic have no connect any doctor"
                  description="Pleas add doctor in your clinic"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <AddDoctorMembership handleBackToList={handleBackToList} />
      )}
    </div>
  );
}
//  <MembershipDoctorsAndScheduleManagement
//           handleBackToList={handleBackToList}
//           doctor={selectedDoctor?.doctor}
//           initialSchedules={selectedDoctor?.schedules}
//           membershipId={selectedDoctor.id}
//         />
