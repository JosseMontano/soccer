import { z } from "zod";

// Validar la creación de un partido
export const createGameSchema = z
  .object({
    firstTeamId: z.string({
      required_error: "El ID del primer equipo es obligatorio",
    }),
    secondTeamId: z.string({
      required_error: "El ID del segundo equipo es obligatorio",
    }),
    tournamentId: z.string({
      required_error: "El ID del torneo es obligatorio",
    }),
    date: z
      .string()
      .refine((date) => {
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime()) && parsedDate > new Date();
      }, {
        message: "La fecha debe ser válida y posterior a la fecha actual",
      }),
    goalsFirstTeam: z.number().min(0, "Los goles del primer equipo no pueden ser negativos").optional(),
    goalsSecondTeam: z.number().min(0, "Los goles del segundo equipo no pueden ser negativos").optional(),
    yellowCardsFirstTeam: z.number().min(0, "Las tarjetas amarillas del primer equipo no pueden ser negativas").optional(),
    yellowCardsSecondTeam: z.number().min(0, "Las tarjetas amarillas del segundo equipo no pueden ser negativas").optional(),
    redCardsFirstTeam: z.number().min(0, "Las tarjetas rojas del primer equipo no pueden ser negativas").optional(),
    redCardsSecondTeam: z.number().min(0, "Las tarjetas rojas del segundo equipo no pueden ser negativas").optional(),
    foulsFirstTeam: z.number().min(0, "Las faltas del primer equipo no pueden ser negativas").optional(),
    foulsSecondTeam: z.number().min(0, "Las faltas del segundo equipo no pueden ser negativas").optional(),
  })
  .refine((data) => data.firstTeamId !== data.secondTeamId, {
    message: "El primer equipo no puede ser igual al segundo equipo",
    path: ["secondTeamId"], // Apunta a este campo como el causante del error
  });

// Validar la actualización de un partido
export const updateGameSchema = z.object({
  firstTeamId: z.string().optional(),
  secondTeamId: z.string().optional(),
  tournamentId: z.string().optional(),
  date: z.string().optional(),
  goalsFirstTeam: z.number().min(0, "Los goles del primer equipo no pueden ser negativos").optional(),
  goalsSecondTeam: z.number().min(0, "Los goles del segundo equipo no pueden ser negativos").optional(),
  yellowCardsFirstTeam: z.number().min(0, "Las tarjetas amarillas del primer equipo no pueden ser negativas").optional(),
  yellowCardsSecondTeam: z.number().min(0, "Las tarjetas amarillas del segundo equipo no pueden ser negativas").optional(),
  redCardsFirstTeam: z.number().min(0, "Las tarjetas rojas del primer equipo no pueden ser negativas").optional(),
  redCardsSecondTeam: z.number().min(0, "Las tarjetas rojas del segundo equipo no pueden ser negativas").optional(),
  foulsFirstTeam: z.number().min(0, "Las faltas del primer equipo no pueden ser negativas").optional(),
  foulsSecondTeam: z.number().min(0, "Las faltas del segundo equipo no pueden ser negativas").optional(),
}).refine((data) => {
  if (data.firstTeamId && data.secondTeamId) {
    return data.firstTeamId !== data.secondTeamId;
  }
  return true;
}, {
  message: "El primer equipo no puede ser igual al segundo equipo",
  path: ["secondTeamId"],
});