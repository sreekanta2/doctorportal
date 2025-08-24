// lib/schedule-helpers.ts (or incorporate directly into your route for now)

import { WeekDaySchema } from "@/zod-validation/enum";
import { z } from "zod";

// Converts HH:MM string to minutes from midnight for easy comparison
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Checks for overlap between two time ranges (e.g., [start1, end1] and [start2, end2])
// Assumes times are in HH:MM format and within a single day.
export const hasTimeOverlap = (
  newStartTime: string,
  newEndTime: string,
  existingStartTime: string,
  existingEndTime: string
): boolean => {
  const newStart = timeToMinutes(newStartTime);
  const newEnd = timeToMinutes(newEndTime);
  const existingStart = timeToMinutes(existingStartTime);
  const existingEnd = timeToMinutes(existingEndTime);

  // No overlap if new schedule ends before existing one starts
  // OR new schedule starts after existing one ends
  return !(newEnd <= existingStart || newStart >= existingEnd);
};

// Converts WeekDay enum to a numeric value for comparison
const getWeekDayValue = (day: z.infer<typeof WeekDaySchema>): number => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days.indexOf(day);
};

// Checks if a given day (as a string from WeekDaySchema) falls within a start-end day range
export const isDayWithinRange = (
  dayToCheck: z.infer<typeof WeekDaySchema>,
  rangeStartDay: z.infer<typeof WeekDaySchema>,
  rangeEndDay: z.infer<typeof WeekDaySchema>
): boolean => {
  const dayVal = getWeekDayValue(dayToCheck);
  const startVal = getWeekDayValue(rangeStartDay);
  const endVal = getWeekDayValue(rangeEndDay);

  if (startVal <= endVal) {
    // Normal week range (e.g., Monday to Friday)
    return dayVal >= startVal && dayVal <= endVal;
  } else {
    // Wraps around the week (e.g., Friday to Monday)
    return dayVal >= startVal || dayVal <= endVal;
  }
};
