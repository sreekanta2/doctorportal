// app/actions/City.ts
"use server";

import {
  serverActionCreatedResponse,
  serverActionErrorResponse,
  serverActionSuccessResponse,
} from "@/lib/actions/server-actions-response";
import prisma from "@/lib/db";
import {
  CreateCityInput,
  createCitySchema,
  UpdateCityInput,
  updateCitySchema,
} from "@/zod-validation/city";
import { revalidatePath } from "next/cache";

/**
 * Create City
 */
export async function createCity(data: CreateCityInput) {
  const parsed = createCitySchema.parse(data);

  try {
    const City = await prisma.city.create({
      data: {
        ...parsed,
      },
    });
    revalidatePath(`/admin/cities`);
    return serverActionCreatedResponse(City);
  } catch (error: any) {
    return serverActionErrorResponse(error);
  }
}

/**
 * Update City
 */
export async function updateCity(data: UpdateCityInput) {
  const parsed = updateCitySchema.parse(data);

  try {
    const totalDoctors = await prisma.doctor.count({
      where: {
        city: parsed.name,
      },
    });

    const City = await prisma.city.update({
      where: { id: parsed.id },
      data: {
        ...parsed,
      },
    });
    revalidatePath(`/admin/cities`);

    return serverActionSuccessResponse(City);
  } catch (error: any) {
    return serverActionErrorResponse(error);
  }
}

/**
 * Delete City
 */
export async function deleteCity(id: string) {
  try {
    const City = await prisma.city.delete({
      where: { id },
    });

    revalidatePath(`/admin/cities`);
    return serverActionSuccessResponse(City);
  } catch (error: any) {
    return serverActionErrorResponse(error);
  }
}
