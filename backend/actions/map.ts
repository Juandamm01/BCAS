"use server";

import { prisma } from "@/backend/prisma";
import { revalidatePath } from "next/cache";

export async function getMapPoints() {
  try {
    const points = await prisma.mapPoint.findMany({ orderBy: { id: "asc" } });
    return points.map((point) => ({
      ...point,
      lat: (point as unknown as { lat?: number | null }).lat ?? point.y ?? null,
      lng: (point as unknown as { lng?: number | null }).lng ?? point.x ?? null,
    }));
  } catch {
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
    const latValue = typeof data.lat === "number" ? data.lat : undefined;
    const lngValue = typeof data.lng === "number" ? data.lng : undefined;
    await prisma.mapPoint.update({
      where: { id },
      data: {
        nombre: data.nombre,
        x: lngValue ?? data.x ?? 0,
        y: latValue ?? data.y ?? 0,
        dotX: data.dotX ?? 0,
        dotY: data.dotY ?? 0,
        color: data.color ?? "#2563EB",
        radio: data.radio ?? 300,
      },
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
    const latValue = typeof data.lat === "number" ? data.lat : undefined;
    const lngValue = typeof data.lng === "number" ? data.lng : undefined;
    await prisma.mapPoint.create({
      data: {
        nombre: data.nombre,
        x: lngValue ?? data.x ?? 0,
        y: latValue ?? data.y ?? 0,
        dotX: data.dotX ?? 0,
        dotY: data.dotY ?? 0,
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
