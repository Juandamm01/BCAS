"use server";

import { prisma } from "@/backend/prisma";
import { revalidatePath } from "next/cache";
import { uploadToS3 } from "@/lib/s3";

const DEFAULT_CONNECTION_IMAGE = "/images/conexion.png";

export async function getConnectionConfig() {
  try {
    const config = await prisma.connectionConfig.findUnique({
      where: { id: 1 },
      include: { features: { orderBy: { id: "asc" } } },
    });

    if (config) {
      return {
        ...config,
        backgroundImage: (config as unknown as { backgroundImage?: string | null }).backgroundImage || DEFAULT_CONNECTION_IMAGE,
      };
    }

    try {
      return await prisma.connectionConfig.create({
        data: {
          id: 1,
          titulo: "Conexión confiable para tu día a día",
          subtitulo:
            "Disfruta internet estable, rápido y pensado para tu hogar, con soporte cercano y una experiencia sin complicaciones.",
          buttonText: "Empezar ahora",
          backgroundImage: DEFAULT_CONNECTION_IMAGE,
          features: {
            create: [
              { text: "Conexión estable", icon: "wifi" },
              { text: "Velocidad ideal para tu hogar", icon: "wifi" },
              { text: "Instalación rápida", icon: "wifi" },
              { text: "Soporte técnico cercano", icon: "wifi" },
              { text: "Planes adaptados a ti", icon: "wifi" },
            ],
          },
        },
        include: { features: { orderBy: { id: "asc" } } },
      });
    } catch {
      const legacyConfig = await prisma.connectionConfig.create({
        data: {
          id: 1,
          titulo: "Conexión confiable para tu día a día",
          subtitulo:
            "Disfruta internet estable, rápido y pensado para tu hogar, con soporte cercano y una experiencia sin complicaciones.",
          buttonText: "Empezar ahora",
          features: {
            create: [
              { text: "Conexión estable", icon: "wifi" },
              { text: "Velocidad ideal para tu hogar", icon: "wifi" },
              { text: "Instalación rápida", icon: "wifi" },
              { text: "Soporte técnico cercano", icon: "wifi" },
              { text: "Planes adaptados a ti", icon: "wifi" },
            ],
          },
        },
        include: { features: { orderBy: { id: "asc" } } },
      });
      return { ...legacyConfig, backgroundImage: DEFAULT_CONNECTION_IMAGE };
    }
  } catch (error) {
    console.error("Error fetching connection config:", error);
    return null;
  }
}

export async function updateConnectionConfig(data: {
  titulo: string;
  subtitulo: string;
  buttonText: string;
  backgroundImage: string;
  features: string[];
}) {
  try {
    try {
      await prisma.connectionConfig.upsert({
        where: { id: 1 },
        update: {
          titulo: data.titulo,
          subtitulo: data.subtitulo,
          buttonText: data.buttonText,
          backgroundImage: data.backgroundImage,
          features: {
            deleteMany: {},
            create: data.features.map((text) => ({ text, icon: "wifi" })),
          },
        },
        create: {
          id: 1,
          titulo: data.titulo,
          subtitulo: data.subtitulo,
          buttonText: data.buttonText,
          backgroundImage: data.backgroundImage,
          features: {
            create: data.features.map((text) => ({ text, icon: "wifi" })),
          },
        },
      });
    } catch {
      await prisma.connectionConfig.upsert({
        where: { id: 1 },
        update: {
          titulo: data.titulo,
          subtitulo: data.subtitulo,
          buttonText: data.buttonText,
          features: {
            deleteMany: {},
            create: data.features.map((text) => ({ text, icon: "wifi" })),
          },
        },
        create: {
          id: 1,
          titulo: data.titulo,
          subtitulo: data.subtitulo,
          buttonText: data.buttonText,
          features: {
            create: data.features.map((text) => ({ text, icon: "wifi" })),
          },
        },
      });
    }
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating connection config:", error);
    return { success: false };
  }
}

export async function updateConnectionImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "No file provided" };

    const buffer = Buffer.from(await file.arrayBuffer());
    const imageUrl = await uploadToS3(buffer, file.name, file.type);

    try {
      await prisma.connectionConfig.upsert({
        where: { id: 1 },
        update: { backgroundImage: imageUrl },
        create: { id: 1, backgroundImage: imageUrl },
      });
    } catch {
      return { success: false, error: "La base de datos aun no tiene el campo de imagen de conexion. Ejecuta migracion Prisma." };
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true, url: imageUrl };
  } catch (error) {
    console.error("Connection image update error:", error);
    return { success: false, error: "Upload failed" };
  }
}
