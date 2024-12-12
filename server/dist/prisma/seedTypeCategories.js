"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function seedTypeCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        const typeCategories = [
            { id: "promocionales-varones-uuid", name: "Promocionales Varones" },
            { id: "promocionales-damas-uuid", name: "Promocionales Damas" },
            { id: "profesionales-uuid", name: "Profesionales" },
        ];
        for (const typeCategory of typeCategories) {
            yield prisma.typeCategories.upsert({
                where: { id: typeCategory.id },
                update: {},
                create: typeCategory,
            });
        }
        console.log("Semilla de TypeCategories creada correctamente.");
    });
}
seedTypeCategories()
    .catch((e) => {
    console.error("Error al insertar las semillas de TypeCategories:", e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
