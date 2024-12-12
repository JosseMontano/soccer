"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(1, "El correo electrónico es requerido")
        .max(50, "El correo no puede exceder 50 caracteres")
        .email("El correo electrónico no es válido")
        .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "El correo debe ser una dirección de Gmail"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Correo electrónico no válido"),
    password: zod_1.z.string().min(1, "La contraseña es requerida"),
});
