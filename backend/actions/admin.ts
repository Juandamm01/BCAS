"use server";

import { prisma } from "@/backend/prisma";
import { revalidatePath } from "next/cache";
import { uploadToS3 } from "@/lib/s3";

export async function getAdminData(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });
  } catch {
    return null;
  }
}

export async function getAdminUsers() {
  try {
    return await prisma.user.findMany({
      where: { role: "admin" },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.error("Get Admin Users Error:", error);
    return [];
  }
}

export async function updateProfilePhoto(email: string, formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "No file provided" };

    const buffer = Buffer.from(await file.arrayBuffer());
    const imageUrl = await uploadToS3(buffer, file.name, file.type);

    await prisma.user.update({
      where: { email },
      data: { image: imageUrl },
    });

    revalidatePath("/admin/dashboard");
    return { success: true, url: imageUrl };
  } catch (error) {
    console.error("Profile Photo Update Error:", error);
    return { success: false, error: "Upload failed" };
  }
}

export async function removeProfilePhoto(email: string) {
  try {
    await prisma.user.update({
      where: { email },
      data: { image: null },
    });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Remove Profile Photo Error:", error);
    return { success: false };
  }
}
