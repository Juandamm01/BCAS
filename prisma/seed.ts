import { PrismaClient } from "@prisma/client";
import { auth } from "../lib/auth";

const prisma = new PrismaClient();

async function main() {
  // --- SEED ADMIN ---
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  await auth.api.signUpEmail({
    body: {
      name: "Henry Gonzalez",
      email: "henro@gmail.com",
      password: "12345678",
    },
  });

  await prisma.user.update({
    where: { email: "henro@gmail.com" },
    data: { role: "admin" },
  });

  // --- SEED PLANS ---
  await prisma.plan.deleteMany();

  const plansData = [
    // La Nohora y San Luis
    { zona: "nohora", suscripcion: "89.000", speed: "50MB", tv: "1 Punto de TV GRATIS", price: "68K", order: 1 },
    { zona: "nohora", suscripcion: "89.000", speed: "100MB", tv: "2 Punto de TV GRATIS", price: "95K", order: 2, isPopular: true },
    { zona: "nohora", suscripcion: "89.000", speed: "200MB", tv: "2 Punto de TV GRATIS", price: "105K", order: 3 },
    
    // La Zuria
    { zona: "zuria", suscripcion: "89.000", speed: "50MB", tv: "1 Punto de TV GRATIS", price: "105K", order: 1 },
    { zona: "zuria", suscripcion: "89.000", speed: "25MB", tv: "1 Punto de TV GRATIS", price: "85K", order: 2 },
    { zona: "zuria", suscripcion: "89.000", speed: "25MB", tv: "1 Punto de TV GRATIS", price: "75K", order: 3 },

    // Mesetas, El Triángulo, La Sultana...
    { zona: "mesetas", suscripcion: "99.000", speed: "50MB", tv: "1 Punto de TV GRATIS", price: "68K", order: 1 },
    { zona: "mesetas", suscripcion: "99.000", speed: "100MB", tv: "2 Punto de TV GRATIS", price: "95K", order: 2, isPopular: true },
    { zona: "mesetas", suscripcion: "99.000", speed: "200MB", tv: "2 Punto de TV GRATIS", price: "105K", order: 3 },
  ];

  for (const p of plansData) {
    await prisma.plan.create({ data: p });
  }

  // --- SEED HERO ---
  await prisma.heroConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      bienvenido: "Velocidad estable incluso en zonas donde otros no llegan.",
      empresa: "Bioconstructores Asociados Sas",
      slogan: "Disfruta de hasta +200MB en Villavicencio.",
      heroImage: "/images/fondo.png"
    }
  });

  // --- SEED MAP POINTS ---
  await prisma.mapPoint.deleteMany();
  const points = [
    { nombre: "La Azotea", lat: 4.142868, lng: -73.650565, color: "#DC2626", radio: 300 },
    { nombre: "Mesetas Bajas", lat: 4.145460, lng: -73.655689, color: "#2563EB", radio: 350 },
    { nombre: "Mesetas - La Sultana - El Triángulo - San Francisco - Mesetas Alto", lat: 4.151987, lng: -73.657689, color: "#F59E0B", radio: 400 },
    { nombre: "Rondinella", lat: 4.156844, lng: -73.660360, color: "#10B981", radio: 300 },
    { nombre: "Galán", lat: 4.155597, lng: -73.657949, color: "#9333EA", radio: 250 },
    { nombre: "La Nohora", lat: 4.079677, lng: -73.696592, color: "#14B8A6", radio: 450 },
    { nombre: "San Luis de Ocoa Bajo", lat: 4.078900, lng: -73.704115, color: "#F43F5E", radio: 400 },
    { nombre: "Quintas de la Suria", lat: 4.082271, lng: -73.640960, color: "#64748B", radio: 350 },
  ];
  for (const p of points) {
    await prisma.mapPoint.create({ data: p });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
