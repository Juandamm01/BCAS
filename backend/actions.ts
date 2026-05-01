"use server";

import {
  getHeroConfig as getHeroConfigImpl,
  updateHeroConfig as updateHeroConfigImpl,
  updateHeroImage as updateHeroImageImpl,
} from "@/backend/actions/hero";
import {
  getConnectionConfig as getConnectionConfigImpl,
  updateConnectionConfig as updateConnectionConfigImpl,
  updateConnectionImage as updateConnectionImageImpl,
} from "@/backend/actions/connection";
import {
  getPlans,
  updatePlan as updatePlanImpl,
  deletePlan as deletePlanImpl,
  createPlan as createPlanImpl,
} from "@/backend/actions/plans";
import {
  getMapPoints as getMapPointsImpl,
  updateMapPoint as updateMapPointImpl,
  createMapPoint as createMapPointImpl,
  deleteMapPoint as deleteMapPointImpl,
} from "@/backend/actions/map";
import {
  getAdminData as getAdminDataImpl,
  getAdminUsers as getAdminUsersImpl,
  updateProfilePhoto as updateProfilePhotoImpl,
  removeProfilePhoto as removeProfilePhotoImpl,
} from "@/backend/actions/admin";

export async function getHeroConfig() {
  return getHeroConfigImpl();
}

export async function updateHeroConfig(data: { bienvenido: string; empresa: string; slogan: string; heroImage: string }) {
  return updateHeroConfigImpl(data);
}

export async function updateHeroImage(formData: FormData) {
  return updateHeroImageImpl(formData);
}

export async function getConnectionConfig() {
  return getConnectionConfigImpl();
}

export async function updateConnectionConfig(data: {
  titulo: string;
  subtitulo: string;
  buttonText: string;
  backgroundImage: string;
  features: string[];
}) {
  return updateConnectionConfigImpl(data);
}

export async function updateConnectionImage(formData: FormData) {
  return updateConnectionImageImpl(formData);
}

export { getPlans };

export async function updatePlan(id: number, data: any) {
  return updatePlanImpl(id, data);
}

export async function deletePlan(id: number) {
  return deletePlanImpl(id);
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
  return createPlanImpl(data);
}

export async function getMapPoints() {
  return getMapPointsImpl();
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
  return updateMapPointImpl(id, data);
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
  return createMapPointImpl(data);
}

export async function deleteMapPoint(id: number) {
  return deleteMapPointImpl(id);
}

export async function getAdminData(email: string) {
  return getAdminDataImpl(email);
}

export async function getAdminUsers() {
  return getAdminUsersImpl();
}

export async function updateProfilePhoto(email: string, formData: FormData) {
  return updateProfilePhotoImpl(email, formData);
}

export async function removeProfilePhoto(email: string) {
  return removeProfilePhotoImpl(email);
}
