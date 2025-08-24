import { AppError } from "@/lib/actions/actions-error-response";
import {
  createSuccessResponse,
  errorResponse,
  successResponse,
} from "@/lib/api/api-response";
import prisma from "@/lib/db";

import { isTimeAfter, updateScheduleSchema } from "@/zod-validation/schedule";
import { NextRequest } from "next/server";
export async function PUT(
  req: NextRequest,
  { params }: { params: { sid: string } }
) {
  const { sid } = params;
  const body = await req.json();

  try {
    const validData = updateScheduleSchema.safeParse(body);
    if (!validData?.success) {
      return errorResponse(validData.error);
    }
    const { membershipId, startDay, endDay, startTime, endTime } =
      validData?.data;

    if (!isTimeAfter(endTime, startTime)) {
      throw new AppError("End time must be after start time.", 400);
    }
    const schedule = await prisma.schedule.findUnique({
      where: { id: sid },
    });

    if (!schedule) {
      throw new AppError("Schedule not found.", 404);
    }
    // const conflictingSchedules = await prisma.schedule.findMany({
    //   where: {
    //     membershipId: membershipId,

    //     OR: [
    //       {
    //         starDay: { in: [starDay, endDay] },
    //       },
    //       {
    //         endDay: { in: [starDay, endDay] },
    //       },
    //       {
    //         AND: [
    //           { starDay: { equals: starDay } },
    //           { endDay: { equals: endDay } },
    //         ],
    //       },
    //     ],
    //   },
    // });

    // const hasOverlap = conflictingSchedules.some((existingSchedule) => {
    //   if (starDay !== endDay) {
    //     if (
    //       isDayWithinRange(
    //         starDay,
    //         existingSchedule.starDay,
    //         existingSchedule.endDay
    //       ) ||
    //       isDayWithinRange(
    //         endDay,
    //         existingSchedule.starDay,
    //         existingSchedule.endDay
    //       ) ||
    //       isDayWithinRange(existingSchedule.starDay, starDay, endDay)
    //     ) {
    //       return hasTimeOverlap(
    //         startTime,
    //         endTime,
    //         existingSchedule.startTime,
    //         existingSchedule.endTime
    //       );
    //     }
    //     return false;
    //   } else {
    //     // Single day schedule (starDay === endDay)
    //     if (
    //       isDayWithinRange(
    //         starDay,
    //         existingSchedule.starDay,
    //         existingSchedule.endDay
    //       )
    //     ) {
    //       return hasTimeOverlap(
    //         startTime,
    //         endTime,
    //         existingSchedule.startTime,
    //         existingSchedule.endTime
    //       );
    //     }
    //     return false;
    //   }
    // });

    // if (hasOverlap) {
    //   throw new AppError(
    //     "Schedule time overlaps with an existing schedule for this membership on the specified day(s)."
    //   );
    // }
    const updatedSchedule = await prisma.schedule.update({
      where: { id: sid },
      data: validData?.data,
    });

    return createSuccessResponse(updatedSchedule);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { sid: string } }
) {
  const { sid } = params;
  try {
    const exitingSchedule = await prisma.schedule.findUnique({
      where: {
        id: sid,
      },
    });
    if (!exitingSchedule) {
      throw new AppError("schedule are not exit !");
    }
    const deleteSchedule = await prisma.schedule.delete({
      where: {
        id: sid,
      },
    });
    return successResponse(deleteSchedule, {
      message: "Schedule are deleted!",
    });
  } catch (error) {
    return errorResponse(error);
  }
}
