// app/api/schedules/route.ts
import { AppError } from "@/lib/actions/actions-error-response";
import { createSuccessResponse, errorResponse } from "@/lib/api/api-response";
import prisma from "@/lib/db";

import { hasTimeOverlap, isDayWithinRange } from "@/lib/schudle-helper";
import { createScheduleSchema, isTimeAfter } from "@/zod-validation/schedule"; // Import Zod schema and time helper
import { NextRequest } from "next/server";

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json();

  try {
    const validData = createScheduleSchema.safeParse(body);
    if (!validData.success) {
      return errorResponse(validData.error);
    }
    const { membershipId, startDay, endDay, startTime, endTime } =
      validData?.data;
    // 2. Validate time logic (startTime must be before endTime)
    if (!isTimeAfter(endTime, startTime)) {
      throw new AppError("End time must be after start time.", 400);
    }

    const existingMembership = await prisma.clinicMembership.findUnique({
      where: { id: membershipId },
    });

    if (!existingMembership) {
      throw new AppError("Clinic membership not found.", 404);
    }

    const conflictingSchedules = await prisma.schedule.findMany({
      where: {
        membershipId: membershipId,

        OR: [
          {
            startDay: { in: [startDay, endDay] },
          },
          {
            endDay: { in: [startDay, endDay] },
          },
          {
            AND: [
              { startDay: { equals: startDay } },
              { endDay: { equals: endDay } },
            ],
          },
        ],
      },
    });

    const hasOverlap = conflictingSchedules.some((existingSchedule) => {
      if (startDay !== endDay) {
        if (
          isDayWithinRange(
            startDay,
            existingSchedule.startDay,
            existingSchedule.endDay
          ) ||
          isDayWithinRange(
            endDay,
            existingSchedule.startDay,
            existingSchedule.endDay
          ) ||
          isDayWithinRange(existingSchedule.startDay, startDay, endDay)
        ) {
          return hasTimeOverlap(
            startTime,
            endTime,
            existingSchedule.startTime,
            existingSchedule.endTime
          );
        }
        return false;
      } else {
        // Single day schedule (starDay === endDay)
        if (
          isDayWithinRange(
            startDay,
            existingSchedule.startDay,
            existingSchedule.endDay
          )
        ) {
          return hasTimeOverlap(
            startTime,
            endTime,
            existingSchedule.startTime,
            existingSchedule.endTime
          );
        }
        return false;
      }
    });

    if (hasOverlap) {
      throw new AppError(
        "Schedule time overlaps with an existing schedule for this membership on the specified day(s)."
      );
    }

    // 6. Create the Schedule
    const newSchedule = await prisma.schedule.create({
      data: {
        membershipId,
        startDay,
        endDay,
        startTime,
        endTime,
      },
      select: {
        id: true,
        membershipId: true,
        startDay: true,
        endDay: true,
        startTime: true,
        endTime: true,
      },
    });
    return createSuccessResponse(newSchedule);
  } catch (error) {
    return errorResponse(error);
  }
}
