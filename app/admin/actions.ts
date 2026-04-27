"use server";

import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function signInAdminAction(data: { email: string; password: string }) {
  try {
    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
      headers: await headers(),
    });

    return { success: true as const };
  } catch (error) {
    // Fallback temporal mientras se termina de sincronizar Better Auth en DB.
    if (data.email === "henro@gmail.com" && data.password === "12345678") {
      const cookieStore = await cookies();
      cookieStore.set("bcas_admin_legacy", "1", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 12,
      });
      return { success: true as const };
    }

    return {
      success: false as const,
      message: "Correo o contraseña incorrectos",
    };
  }
}

export async function signOutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.delete("bcas_admin_legacy");

  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    return { success: true as const };
  } catch {
    // Si Better Auth falla, al menos cerramos la sesión legacy.
    return { success: true as const };
  }
}
