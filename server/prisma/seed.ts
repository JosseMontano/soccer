import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedTypeOfPass() {
  const passes = [
    { id: "definitivo-uuid", name: "Definitivo" },
    { id: "prestamo-uuid", name: "Préstamo" }
  ];

  for (const pass of passes) {
    await prisma.typeOfPass.upsert({
      where: { id: pass.id },
      update: {},
      create: pass
    });
  }
  console.log("Semilla de TypeOfPass creada exitosamente.");
}

// Llama a la función dentro del main
async function main() {
  // Semilla para formatos
  const formats = [
    { id: "ida-vuelta-uuid", name: "Ida y Vuelta" },
    { id: "eliminacion-directa-uuid", name: "Eliminación Directa" }
  ];

  for (const format of formats) {
    await prisma.format.upsert({
      where: { id: format.id },
      update: {},
      create: format
    });
  }
  console.log("Semilla de Format creada exitosamente.");

  // Semilla de TypeOfPass
  await seedTypeOfPass();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });