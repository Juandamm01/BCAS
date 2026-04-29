"use server";

import { prisma } from "@/backend/prisma";
import { revalidatePath } from "next/cache";
import { uploadToS3 } from "@/lib/s3";

export async function getHeroConfig() {
  try {
    return (await prisma.heroConfig.findFirst()) || (await prisma.heroConfig.create({ data: {} }));
  } catch (error) {
    console.error("Error fetching hero config:", error);
    return null;
  }
}

export async function updateHeroConfig(data: { bienvenido: string; empresa: string; slogan: string; heroImage: string }) {
  try {
    await prisma.heroConfig.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating hero config:", error);
    return { success: false };
  }
}

export async function updateHeroImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "No file provided" };

    const buffer = Buffer.from(await file.arrayBuffer());
    const imageUrl = await uploadToS3(buffer, file.name, file.type);

    await prisma.heroConfig.upsert({
      where: { id: 1 },
      update: { heroImage: imageUrl },
      create: { id: 1, heroImage: imageUrl },
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true, url: imageUrl };
  } catch (error) {
    console.error("Hero image update error:", error);
    return { success: false, error: "Upload failed" };
  }
}
