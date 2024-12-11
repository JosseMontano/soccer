import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedCategories() {
  const categories = [
    // Promocionales Varones
    { id: "sub6-uuid", name: "Sub-6", typeCategoryId: "promocionales-varones-uuid", minAge: 0, maxAge: 6 },
    { id: "sub8-uuid", name: "Sub-8", typeCategoryId: "promocionales-varones-uuid", minAge: 7, maxAge: 8 },
    { id: "sub10-uuid", name: "Sub-10", typeCategoryId: "promocionales-varones-uuid", minAge: 9, maxAge: 10 },
    { id: "sub12-uuid", name: "Sub-12", typeCategoryId: "promocionales-varones-uuid", minAge: 11, maxAge: 12 },
    { id: "sub14-uuid", name: "Sub-14", typeCategoryId: "promocionales-varones-uuid", minAge: 13, maxAge: 14 },
    { id: "sub16-uuid", name: "Sub-16", typeCategoryId: "promocionales-varones-uuid", minAge: 15, maxAge: 16 },
    { id: "sub18-uuid", name: "Sub-18", typeCategoryId: "promocionales-varones-uuid", minAge: 17, maxAge: 18 },
    { id: "sub20-uuid", name: "Sub-20", typeCategoryId: "promocionales-varones-uuid", minAge: 19, maxAge: 20 },

    // Promocionales Damas
    { id: "sub12-damas-uuid", name: "SubD-12", typeCategoryId: "promocionales-damas-uuid", minAge: 0, maxAge: 12 },
    { id: "sub14-damas-uuid", name: "SubD-14", typeCategoryId: "promocionales-damas-uuid", minAge: 13, maxAge: 14 },
    { id: "sub16-damas-uuid", name: "SubD-16", typeCategoryId: "promocionales-damas-uuid", minAge: 15, maxAge: 16 },
    { id: "sub18-damas-uuid", name: "SubD-18", typeCategoryId: "promocionales-damas-uuid", minAge: 17, maxAge: 18 },
    { id: "sub20-damas-uuid", name: "SubD-20", typeCategoryId: "promocionales-damas-uuid", minAge: 19, maxAge: 20 },

    // Profesionales
    { id: "cuarta-uuid", name: "Cuarta", typeCategoryId: "profesionales-uuid", minAge: 20, maxAge: 120 },
    { id: "tercera-uuid", name: "Tercera", typeCategoryId: "profesionales-uuid", minAge: 20, maxAge: 120 },
    { id: "segunda-uuid", name: "Segunda", typeCategoryId: "profesionales-uuid", minAge: 20, maxAge: 120 },
    { id: "primera-ascenso-uuid", name: "Primera de Ascenso", typeCategoryId: "profesionales-uuid", minAge: 20, maxAge: 120 },
    { id: "primera-honor-uuid", name: "Primera de Honor", typeCategoryId: "profesionales-uuid", minAge: 20, maxAge: 120 },
  ];

  for (const category of categories) {
    await prisma.categories.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }

  console.log("Semilla de Categories creada correctamente.");
}

seedCategories()
  .catch((e) => {
    console.error("Error al insertar las semillas de Categories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });