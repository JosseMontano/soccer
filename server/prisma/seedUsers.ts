import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seedUsers() {
  const roles = [
    { id: "1", name: "superAdmin" },
    { id: "2", name: "admin" },
    { id: "3", name: "manager" },
    { id: "4", name: "user" },
  ];

  for (const v of roles) {
    await prisma.roles.create({
      data: {
        id: v.id,
        name: v.name,
      },
    });
  }
  const hashedPassword = await bcrypt.hash("123456", 10);
  await prisma.users.create({
    data: {
      email: "superadmin@gmail.com",
      password: hashedPassword,
      roleId: roles[0].id,
    },
  });
}

seedUsers()
  .catch((e) => {
    console.error("Error al insertar las semillas de users:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
