"use server";

import { prisma } from "@/backend/prisma";
import { revalidatePath } from "next/cache";
import { uploadToS3 } from "@/lib/s3";

// --- HERO ACTIONS ---
export async function getHeroConfig() {
  try {
    return await prisma.heroConfig.findFirst() || await prisma.heroConfig.create({ data: {} });
  } catch (error) {
    console.error("Error fetching hero config:", error);
    return null;
  }
}

export async function updateHeroConfig(data: { bienvenido: string, empresa: string, slogan: string, heroImage: string }) {
  try {
    await prisma.heroConfig.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data }
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

// --- CONNECTION ACTIONS ---
export async function getConnectionConfig() {
  try {
    return (
      (await prisma.connectionConfig.findUnique({
        where: { id: 1 },
        include: { features: { orderBy: { id: "asc" } } },
      })) ||
      (await prisma.connectionConfig.create({
        data: {
          id: 1,
          titulo: "Conexión confiable para tu día a día",
          subtitulo: "Disfruta internet estable, rápido y pensado para tu hogar, con soporte cercano y una experiencia sin complicaciones.",
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
      }))
    );
  } catch (error) {
    console.error("Error fetching connection config:", error);
    return null;
  }
}

export async function updateConnectionConfig(data: {
  titulo: string;
  subtitulo: string;
  buttonText: string;
  features: string[];
}) {
  try {
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
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating connection config:", error);
    return { success: false };
  }
}

// --- PLAN ACTIONS ---
export async function getPlans(zona?: string) {
  try {
    const where = zona ? { zona } : {};
    return await prisma.plan.findMany({
      where,
      orderBy: { order: "asc" }
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return [];
  }
}

export async function updatePlan(id: number, data: any) {
  try {
    await prisma.plan.update({
      where: { id },
      data
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating plan:", error);
    return { success: false };
  }
}

export async function deletePlan(id: number) {
  try {
    await prisma.plan.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function createPlan(data: {
  speed: string;
  price: string;
  tv: string;
  monthLabel?: string;
  description?: string;
  buttonLabel?: string;
  includeLabel?: string;
  popularLabel?: string;
  suscripcion: string;
  zona: string;
  order: number;
  isPopular?: boolean;
}) {
  try {
    await prisma.plan.create({
      data: {
        speed: data.speed,
        price: data.price,
        tv: data.tv,
        monthLabel: data.monthLabel ?? "/mes",
        description:
          data.description ??
          "Ideal para hogares que buscan conexión estable para navegar, estudiar y disfrutar contenido sin interrupciones.",
        buttonLabel: data.buttonLabel ?? "Elegir plan",
        includeLabel: data.includeLabel ?? "Incluye",
        popularLabel: data.popularLabel ?? "Popular",
        suscripcion: data.suscripcion,
        zona: data.zona,
        order: data.order,
        isPopular: data.isPopular ?? false,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error creating plan:", error);
    return { success: false };
  }
}

// --- MAP ACTIONS ---
export async function getMapPoints() {
  try {
    return await prisma.mapPoint.findMany({ orderBy: { id: "asc" } });
  } catch (error) {
    return [];
  }
}

export async function updateMapPoint(
  id: number,
  data: {
    nombre: string;
    x?: number;
    y?: number;
    dotX?: number;
    dotY?: number;
    lat?: number;
    lng?: number;
    color?: string;
    radio?: number;
  }
) {
  try {
    await prisma.mapPoint.update({
      where: { id },
      data,
    });
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating map point:", error);
    return { success: false };
  }
}

export async function createMapPoint(data: {
  nombre: string;
  x?: number;
  y?: number;
  dotX?: number;
  dotY?: number;
  lat?: number;
  lng?: number;
  color?: string;
  radio?: number;
}) {
  try {
    await prisma.mapPoint.create({
      data: {
        nombre: data.nombre,
        x: data.x ?? 0,
        y: data.y ?? 0,
        dotX: data.dotX ?? 0,
        dotY: data.dotY ?? 0,
        lat: data.lat,
        lng: data.lng,
        color: data.color ?? "#2563EB",
        radio: data.radio ?? 300,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error creating map point:", error);
    return { success: false };
  }
}

export async function deleteMapPoint(id: number) {
  try {
    await prisma.mapPoint.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting map point:", error);
    return { success: false };
  }
}

// --- USER / PROFILE ACTIONS ---
export async function getAdminData(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true
      }
    });
  } catch (error) {
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
      data: { image: imageUrl }
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
