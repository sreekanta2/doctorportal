"use server";
import { updateScheduleSchema } from "./../zod-validation/schedule";

import { AppError } from "@/lib/actions/actions-error-response";
import {
  serverActionCreatedResponse,
  serverActionErrorResponse,
  ServerActionResponse,
  serverActionSuccessResponse,
} from "@/lib/actions/server-actions-response";
import prisma from "@/lib/db";
import { hasTimeOverlap, isDayWithinRange } from "@/lib/schudle-helper";

import { createScheduleSchema, isTimeAfter } from "@/zod-validation/schedule";

import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createScheduleAction(
  data: z.infer<typeof createScheduleSchema>
): Promise<ServerActionResponse<any>> {
  try {
    const validData = createScheduleSchema.safeParse(data);
    if (!validData.success) {
      return serverActionErrorResponse(validData.error);
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
    revalidatePath("/clinic/doctors");
    return serverActionCreatedResponse(newSchedule);
  } catch (error) {
    return serverActionErrorResponse(error);
  }
}
export async function updateSchedule(
  data: z.infer<typeof updateScheduleSchema>
): Promise<ServerActionResponse<any>> {
  try {
    const validData = updateScheduleSchema.parse(data);

    const { membershipId, endDay, startTime, endTime } = validData;

    if (!isTimeAfter(endTime, startTime)) {
      throw new AppError("End time must be after start time.", 400);
    }
    const schedule = await prisma.schedule.findUnique({
      where: { id: validData?.id },
    });

    if (!schedule) {
      throw new AppError("Schedule not found.", 404);
    }

    const updatedSchedule = await prisma.schedule.update({
      where: { id: validData?.id },
      data: validData,
    });
    revalidatePath("/clinic/doctors");
    return serverActionCreatedResponse(updatedSchedule);
  } catch (error) {
    return serverActionErrorResponse(error);
  }
}

export async function deleteSchedule(
  id: string
): Promise<ServerActionResponse<any>> {
  try {
    const schedule = await prisma.schedule.findUnique({ where: { id } });

    if (!schedule) {
      return serverActionErrorResponse("Schedule not found");
    }

    await prisma.schedule.delete({ where: { id } });
    revalidatePath("/clinic/doctors");
    return serverActionSuccessResponse(null, {
      message: "Schedule deleted",
    });
  } catch (error) {
    return serverActionErrorResponse(error);
  }
}
