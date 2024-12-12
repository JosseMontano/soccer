"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyPlayerSchema = void 0;
const zod_1 = require("zod");
exports.historyPlayerSchema = zod_1.z.object({
    playerId: zod_1.z.string().min(1, "El ID del jugador es requerido"),
    clubId: zod_1.z.string().min(1, "El ID del club es requerido"),
    typeOfPassId: zod_1.z.string().min(1, "El ID del tipo de pase es requerido"),
    active: zod_1.z.boolean(),
    startDate: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), "La fecha de inicio debe ser válida"),
    endDate: zod_1.z.string().optional().refine((date) => date === undefined || !isNaN(Date.parse(date)), "La fecha de fin debe ser válida"),
    goals: zod_1.z.number().min(0, "Los goles deben ser un número no negativo").optional(),
    yellowCards: zod_1.z.number().min(0, "Las tarjetas amarillas deben ser un número no negativo").optional(),
    redCards: zod_1.z.number().min(0, "Las tarjetas rojas deben ser un número no negativo").optional(),
    matchesPlayed: zod_1.z.number().min(0, "Los partidos jugados deben ser un número no negativo").optional(),
});
