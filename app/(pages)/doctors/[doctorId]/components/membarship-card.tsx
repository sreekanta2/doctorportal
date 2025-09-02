import { Building, Calendar, User, Users } from "@/components/svg";
import { Button } from "@/components/ui/button";
import { MembershipWithRelations } from "@/types";
import { format } from "date-fns";
import { Building2, Clock, Phone, Star, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ClinicMembershipCard = ({
  membership,
}: {
  membership: MembershipWithRelations;
}) => {
  return (
    <article
      key={membership?.id}
      className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300 hover:shadow-xl group p-4"
    >
      {/* Top Badge Container */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end p-2">
        {membership?.discount > 0 && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
            Discount {membership?.discount}% Instantly
          </div>
        )}
        {membership?.maxAppointments > 0 && (
          <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
            Max: {membership?.maxAppointments} Appointments
          </div>
        )}
        <div className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full dark:bg-amber-900 dark:text-amber-300">
          Fee: {membership?.fee}৳
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Clinic Image Section */}
        <div className="md:w-1/3  relative   ">
          <div className="sw-full h-72 sm:w-64 sm:h-64  relative overflow-hidden rounded-md">
            {membership?.clinic?.user?.image ||
            membership?.doctor?.user?.image ? (
              <Image
                src={
                  membership?.clinic?.user?.image ||
                  membership?.doctor?.user?.image ||
                  ""
                }
                alt={
                  membership?.clinic?.user?.name ||
                  membership?.doctor?.user?.name ||
                  ""
                }
                fill
                className="object-cover group-hover:scale-105 rounded-md transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className=" w-full h-full bg-blue-100 flex items-center justify-center mb-3">
                {membership?.clinic?.user?.name ? (
                  <Building2 className="w-8 h-8 text-blue-600 " />
                ) : (
                  <User className="w-20 h-20 text-blue-600  " />
                )}
              </div>
            )}

            {/* Rating Overlay */}
            <div className="absolute bottom-4 left-4 flex items-center bg-white/90 dark:bg-gray-900/90 px-3 py-1.5 rounded-full shadow-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {membership?.clinic?.averageRating ||
                  membership?.doctor?.averageRating ||
                  0}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className=" mt-2 w-full  space-y-2">
          <div className=" space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {membership?.clinic?.user?.name ||
                ` Dr. ${membership?.doctor?.user?.name}`}
            </h2>
            {membership?.clinic && (
              <Button
                variant="outline"
                className="w-fit  rounded-full flex gap-2 items-center"
              >
                <div className="w-4 h-4">
                  <Users />
                </div>
                <Link href={`/clinics/${membership?.clinic?.id}`}>
                  All Doctors
                </Link>
              </Button>
            )}
            {membership?.doctor && (
              <Button
                variant="outline"
                className=" w-fit  rounded-full flex gap-2 items-center"
              >
                <div className="w-4 h-4">
                  <Building />
                </div>
                <Link href={`/doctors/${membership?.doctor?.id}`}>
                  All Chambers
                </Link>
              </Button>
            )}
          </div>
          {/* Header */}

          <div className="space-y-2">
            {membership?.doctor?.specialization && (
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-blue-100 text-blue-800 md:text-base font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                  {membership?.doctor?.specialization.toUpperCase() ||
                    "General Physician"}
                </div>
              </div>
            )}
            {membership?.doctor?.degree && (
              <h1 className=" text-blue-800 text-xs md:text-base      ">
                {membership?.doctor?.degree.toUpperCase()}
              </h1>
            )}
            {membership?.doctor?.hospital && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg dark:bg-gray-800">
                  <Stethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <p
                  className="text-gray-700 dark:text-gray-300"
                  itemProp="description"
                >
                  {membership?.doctor?.hospital ||
                    "MBBS, BCS (Health), MS (Ortho)"}
                </p>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            {membership?.clinic?.phoneNumber && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg dark:bg-gray-800">
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Phone
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {membership?.clinic?.phoneNumber}
                  </p>
                </div>
              </div>
            )}

            {membership?.clinic?.openingHour && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg dark:bg-gray-800">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Open Until
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {membership?.clinic?.openingHour}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Schedule Section */}
          {membership?.schedules && (
            <div className=" border-t pt-1 border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-3">
                {membership?.schedules?.map((schedule) => (
                  <div
                    key={schedule?.id}
                    className="flex flex-col w-full md:w-fit bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg text-sm hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group/schedule"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className=" bg-blue-50 rounded-lg dark:bg-gray-800">
                        <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {schedule?.startDay} - {schedule?.endDay}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className=" bg-blue-50 rounded-lg dark:bg-gray-800">
                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span>
                        {format(
                          new Date(`1970-01-01T${schedule.startTime}`),
                          "hh:mm a"
                        )}{" "}
                        -{" "}
                        {format(
                          new Date(`1970-01-01T${schedule.endTime}`),
                          "hh:mm a"
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

// You'll need to import Building2 from lucide-react
// import { Building2 } from 'lucide-react';

export default ClinicMembershipCard;
