import { PrismaClient } from "@prisma/client";

/**
 * Sube pool/connect timeout (Prisma por defecto ~10s en el pool).
 * Se sobrescriben siempre para que un DATABASE_URL con pool_timeout=10 no gane.
 */
function withExtendedPoolSettings(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("pool_timeout", "60");
    u.searchParams.set("connect_timeout", "30");
    return u.toString();
  } catch {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}pool_timeout=60&connect_timeout=30`;
  }
}

const prismaClientSingleton = () => {
  const raw = process.env.DATABASE_URL;
  if (!raw) return new PrismaClient();
  return new PrismaClient({
    datasources: {
      db: { url: withExtendedPoolSettings(raw) },
    },
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
