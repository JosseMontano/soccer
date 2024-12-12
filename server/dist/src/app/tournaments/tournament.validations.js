"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryTournamentSchema = exports.updateTournamentSchema = exports.createTournamentSchema = exports.dateValidation = void 0;
const zod_1 = require("zod");
// Validar las fechas del torneo
exports.dateValidation = zod_1.z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "La fecha debe ser válida");
// Validación para crear un torneo
exports.createTournamentSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .min(1, "El nombre del torneo es obligatorio")
        .max(100, "El nombre no puede tener más de 100 caracteres"),
    description: zod_1.z.string().optional(), // Campo opcional
    dateStart: exports.dateValidation,
    dateEnd: exports.dateValidation,
    formatId: zod_1.z.string().min(1, "El formato del torneo es obligatorio"),
    finalFormatId: zod_1.z.string().optional(), // Campo opcional
    categoryId: zod_1.z.string().min(1, "La categoría del torneo es obligatoria"),
    clubIds: zod_1.z
        .array(zod_1.z.string().min(1, "Cada ID de club debe ser válido"))
        .min(2, "Debe haber al menos 2 clubes")
        .refine((arr) => arr.length % 2 === 0, {
        message: "El número de clubes debe ser par",
    }),
})
    .superRefine((data, ctx) => {
    const dateStart = new Date(data.dateStart);
    const dateEnd = new Date(data.dateEnd);
    // Validar que la fecha de fin sea posterior a la fecha de inicio
    if (dateEnd <= dateStart) {
        ctx.addIssue({
            code: "custom",
            path: ["dateEnd"],
            message: "La fecha de finalización debe ser posterior a la fecha de inicio",
        });
    }
    // Validar que el rango de fechas permita al menos un día entre partidos
    const totalDays = Math.ceil((dateEnd.getTime() - dateStart.getTime()) / 86400000);
    if (totalDays < 1) {
        ctx.addIssue({
            code: "custom",
            path: ["dateEnd"],
            message: "El rango de fechas debe cubrir al menos un día.",
        });
    }
});
// Validación para actualizar un torneo
exports.updateTournamentSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "El nombre del torneo es obligatorio")
        .max(100, "El nombre no puede tener más de 100 caracteres")
        .optional(),
    description: zod_1.z.string().optional(),
    dateStart: exports.dateValidation.optional(),
    dateEnd: exports.dateValidation.optional(),
    formatId: zod_1.z.string().optional(),
    finalFormatId: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().optional(),
    status: zod_1.z
        .string()
        .optional()
        .refine((status) => !status || ["pendiente", "en curso", "finalizado"].includes(status), {
        message: "El estado del torneo no es válido",
    }),
});
// Validar los parámetros de consulta (filtros)
exports.queryTournamentSchema = zod_1.z.object({
    categoryId: zod_1.z.string().optional(),
    formatId: zod_1.z.string().optional(),
    dateStart: exports.dateValidation.optional(),
    dateEnd: exports.dateValidation.optional(),
});
