"use server";

import prisma from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  // ✅ Validation
  const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
  const maxSize = 3 * 1024 * 1024; // 3MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPG, PNG, and SVG are allowed.");
  }

  if (file.size > maxSize) {
    throw new Error("File size exceeds 3MB limit.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "uploads" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
}
interface DeleteImageParams {
  email: string;
  imagePath: string;
  medicalRecordId?: string;
}

export async function deleteImage({
  email,
  imagePath,
  medicalRecordId,
}: DeleteImageParams) {
  if (!imagePath) throw new Error("No image path provided");
  const user = await prisma.user.findUnique({
    where: { email },
    include: { patient: true },
  });

  if (!user) throw new Error("User not found");
  await prisma.user.update({
    where: { email },
    data: {
      image: "",
    },
  });

  // If a patient record exists, delete the image from their record
  if (medicalRecordId) {
    await prisma.medicalHistory.update({
      where: { id: medicalRecordId },
      data: {
        document: "",
      },
    });
  }

  // If a full URL is passed → extract public_id
  let publicId = imagePath;
  if (imagePath.startsWith("http")) {
    try {
      const url = new URL(imagePath);
      const parts = url.pathname.split("/");
      const folderAndFile = parts.slice(5).join("/");
      publicId = folderAndFile.replace(/\.[^/.]+$/, "");
    } catch {
      throw new Error("Invalid Cloudinary URL");
    }
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      throw new Error("Failed to delete image");
    }

    return { success: true };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image");
  }
}
