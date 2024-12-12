"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clubSchema = void 0;
const zod_1 = require("zod");
exports.clubSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "El nombre del club es requerido").max(50, "El nombre no puede exceder 50 caracteres"),
    logo: zod_1.z.string().optional(), // Logo opcional
    categoryId: zod_1.z.string().min(1, "El id de la categoria debe ser un uuid valido")
});
