import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedTypeCategories() {
  const typeCategories = [
    { id: "promocionales-varones-uuid", name: "Promocionales Varones" },
    { id: "promocionales-damas-uuid", name: "Promocionales Damas" },
    { id: "profesionales-uuid", name: "Profesionales" },
  ];

  for (const typeCategory of typeCategories) {
    await prisma.typeCategories.upsert({
      where: { id: typeCategory.id },
      update: {},
      create: typeCategory,
    });
  }

  console.log("Semilla de TypeCategories creada correctamente.");
}

seedTypeCategories()
  .catch((e) => {
    console.error("Error al insertar las semillas de TypeCategories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });