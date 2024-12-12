"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormatsSchema = exports.formatIdSchema = exports.createFormatSchema = void 0;
const zod_1 = require("zod");
// Validación para la creación de un nuevo formato
exports.createFormatSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, "El nombre del formato debe tener al menos 3 caracteres")
        .max(50, "El nombre del formato no puede tener más de 50 caracteres"),
});
// Validación para el ID de un formato (puede usarse para endpoints que requieran un ID)
exports.formatIdSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "El ID del formato es obligatorio"),
});
// Validación para la consulta de filtros de formatos (opcional si necesitamos filtrar por criterios)
exports.getFormatsSchema = zod_1.z.object({
    name: zod_1.z.string().optional(), // Si en el futuro queremos filtrar por nombre
});
