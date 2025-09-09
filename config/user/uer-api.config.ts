import prisma from "@/lib/db";
import { User } from "@prisma/client";
export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function getDoctorById(id: string) {
  return prisma.doctor.findUnique({
    where: { id },
    select: {
      specialization: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
}
export async function getClinicById(id: string) {
  return prisma.clinic.findUnique({
    where: { id },
    select: {
      city: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
}
