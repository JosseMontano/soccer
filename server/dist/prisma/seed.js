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
function seedTypeOfPass() {
    return __awaiter(this, void 0, void 0, function* () {
        const passes = [
            { id: "definitivo-uuid", name: "Definitivo" },
            { id: "prestamo-uuid", name: "Préstamo" }
        ];
        for (const pass of passes) {
            yield prisma.typeOfPass.upsert({
                where: { id: pass.id },
                update: {},
                create: pass
            });
        }
        console.log("Semilla de TypeOfPass creada exitosamente.");
    });
}
// Llama a la función dentro del main
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Semilla para formatos
        const formats = [
            { id: "ida-vuelta-uuid", name: "Ida y Vuelta" },
            { id: "eliminacion-directa-uuid", name: "Eliminación Directa" }
        ];
        for (const format of formats) {
            yield prisma.format.upsert({
                where: { id: format.id },
                update: {},
                create: format
            });
        }
        console.log("Semilla de Format creada exitosamente.");
        // Semilla de TypeOfPass
        yield seedTypeOfPass();
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
