"use server";

import { prisma } from "@/backend/prisma";
import { revalidatePath } from "next/cache";

export async function getPlans(zona?: string) {
  try {
    const where = zona ? { zona } : {};
    return await prisma.plan.findMany({
      where,
      orderBy: { order: "asc" },
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
      data,
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
  } catch {
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
