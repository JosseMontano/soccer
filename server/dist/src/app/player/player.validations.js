"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerSchema = void 0;
const zod_1 = require("zod");
exports.playerSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "El nombre del jugador es requerido")
        .max(50, "El nombre no puede exceder 50 caracteres"),
    lastName: zod_1.z
        .string()
        .min(1, "El apellido del jugador es requerido")
        .max(50, "El apellido no puede exceder 50 caracteres"),
    nationality: zod_1.z.string().optional(),
    birthdate: zod_1.z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), "La fecha de nacimiento debe ser válida"),
    gender: zod_1.z.enum(["male", "female"], {
        required_error: "el genero es requerido",
        invalid_type_error: "el genero debe ser male o female",
    }),
    photo: zod_1.z.string().optional(),
    clubId: zod_1.z.string().min(1, "El ID del club es requerido"),
    commet: zod_1.z.string().optional(),
});
