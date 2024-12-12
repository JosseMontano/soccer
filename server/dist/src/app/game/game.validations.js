"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGameSchema = exports.createGameSchema = void 0;
const zod_1 = require("zod");
// Validar la creación de un partido
exports.createGameSchema = zod_1.z
    .object({
    firstTeamId: zod_1.z.string({
        required_error: "El ID del primer equipo es obligatorio",
    }),
    secondTeamId: zod_1.z.string({
        required_error: "El ID del segundo equipo es obligatorio",
    }),
    tournamentId: zod_1.z.string({
        required_error: "El ID del torneo es obligatorio",
    }),
    date: zod_1.z
        .string()
        .refine((date) => {
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime()) && parsedDate > new Date();
    }, {
        message: "La fecha debe ser válida y posterior a la fecha actual",
    }),
    goalsFirstTeam: zod_1.z.number().min(0, "Los goles del primer equipo no pueden ser negativos").optional(),
    goalsSecondTeam: zod_1.z.number().min(0, "Los goles del segundo equipo no pueden ser negativos").optional(),
    yellowCardsFirstTeam: zod_1.z.number().min(0, "Las tarjetas amarillas del primer equipo no pueden ser negativas").optional(),
    yellowCardsSecondTeam: zod_1.z.number().min(0, "Las tarjetas amarillas del segundo equipo no pueden ser negativas").optional(),
    redCardsFirstTeam: zod_1.z.number().min(0, "Las tarjetas rojas del primer equipo no pueden ser negativas").optional(),
    redCardsSecondTeam: zod_1.z.number().min(0, "Las tarjetas rojas del segundo equipo no pueden ser negativas").optional(),
    foulsFirstTeam: zod_1.z.number().min(0, "Las faltas del primer equipo no pueden ser negativas").optional(),
    foulsSecondTeam: zod_1.z.number().min(0, "Las faltas del segundo equipo no pueden ser negativas").optional(),
})
    .refine((data) => data.firstTeamId !== data.secondTeamId, {
    message: "El primer equipo no puede ser igual al segundo equipo",
    path: ["secondTeamId"], // Apunta a este campo como el causante del error
});
// Validar la actualización de un partido
exports.updateGameSchema = zod_1.z.object({
    firstTeamId: zod_1.z.string().optional(),
    secondTeamId: zod_1.z.string().optional(),
    tournamentId: zod_1.z.string().optional(),
    date: zod_1.z.string().optional(),
    goalsFirstTeam: zod_1.z.number().min(0, "Los goles del primer equipo no pueden ser negativos").optional(),
    goalsSecondTeam: zod_1.z.number().min(0, "Los goles del segundo equipo no pueden ser negativos").optional(),
    yellowCardsFirstTeam: zod_1.z.number().min(0, "Las tarjetas amarillas del primer equipo no pueden ser negativas").optional(),
    yellowCardsSecondTeam: zod_1.z.number().min(0, "Las tarjetas amarillas del segundo equipo no pueden ser negativas").optional(),
    redCardsFirstTeam: zod_1.z.number().min(0, "Las tarjetas rojas del primer equipo no pueden ser negativas").optional(),
    redCardsSecondTeam: zod_1.z.number().min(0, "Las tarjetas rojas del segundo equipo no pueden ser negativas").optional(),
    foulsFirstTeam: zod_1.z.number().min(0, "Las faltas del primer equipo no pueden ser negativas").optional(),
    foulsSecondTeam: zod_1.z.number().min(0, "Las faltas del segundo equipo no pueden ser negativas").optional(),
}).refine((data) => {
    if (data.firstTeamId && data.secondTeamId) {
        return data.firstTeamId !== data.secondTeamId;
    }
    return true;
}, {
    message: "El primer equipo no puede ser igual al segundo equipo",
    path: ["secondTeamId"],
});
