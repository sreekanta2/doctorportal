import { AppError } from "@/lib/actions/actions-error-response";
import { createSuccessResponse, errorResponse } from "@/lib/api/api-response";
import prisma from "@/lib/db";
import { createClinicMembershipSchema } from "@/zod-validation/membership";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const validatedData = createClinicMembershipSchema.safeParse(body);

    if (!validatedData.success) {
      return errorResponse(validatedData.error);
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: validatedData.data.clinicId },
      include: { clinic: true },
    });

    if (!existingUser?.clinic?.id) {
      throw new AppError("Complete profile  first");
    }
    const exitingMemberShip = await prisma.clinicMembership.findFirst({
      where: {
        doctorId: validatedData?.data?.doctorId,
        clinicId: existingUser?.clinic?.id,
      },
    });

    if (exitingMemberShip) {
      throw new AppError("This doctor already added your clinic");
    }
    const newMembership = await prisma.clinicMembership.create({
      data: { ...validatedData?.data, clinicId: existingUser.clinic.id },
    });

    const modifyMembership = createSuccessResponse(newMembership, {
      message: "Successfully create membership ",
    });

    return createSuccessResponse(modifyMembership);
  } catch (error) {
    return errorResponse(error);
  }
}
