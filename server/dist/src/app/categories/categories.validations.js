"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorySchema = void 0;
const zod_1 = require("zod");
exports.categorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "El nombre de la categoría es requerido").max(50, "El nombre no puede exceder 50 caracteres"),
    typeCategoryId: zod_1.z.string().min(1, "El tipo de categoría es requerido"),
    minAge: zod_1.z.number().min(0, "La edad mínima debe ser mayor o igual a 0"),
    maxAge: zod_1.z.number().min(1, "La edad máxima debe ser mayor que la mínima"),
});
