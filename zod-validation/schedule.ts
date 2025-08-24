import { z } from "zod";
import { WeekDaySchema } from "./enum"; // Correct Zod enum

// Utility
export const isTimeAfter = (time1: string, time2: string): boolean => {
  const [h1, m1] = time1.split(":").map(Number);
  const [h2, m2] = time2.split(":").map(Number);
  return h1 > h2 || (h1 === h2 && m1 > m2);
};

// Common validators
const timeString = z
  .string()
  .min(1, "Time is required")
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)");

const baseScheduleFields = {
  membershipId: z.string(),
  startDay: WeekDaySchema,
  endDay: WeekDaySchema,
  startTime: timeString,
  endTime: timeString,
};

// Create schema
export const createScheduleSchema = z
  .object(baseScheduleFields)
  .strict()
  .refine((data) => isTimeAfter(data.endTime, data.startTime), {
    message: "End time must be after start time",
    path: ["endTime"],
  });

// Update schema
export const updateScheduleSchema = z
  .object({
    id: z.string(),
    membershipId: z.string(),
    startDay: WeekDaySchema,
    endDay: WeekDaySchema,
    startTime: timeString,
    endTime: timeString,
  })
  .strict()
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return isTimeAfter(data.endTime, data.startTime);
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );
