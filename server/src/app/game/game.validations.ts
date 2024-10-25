import { z } from "zod";

export const gameSchema = z.object({
  firstTeam: z.string().min(1, "El primer equipo es requerido"),
  secondTeam: z.string().min(1, "El segundo equipo es requerido"),
  firstDate: z.string().min(1, "La fecha del primer juego es requerida"),
  secondDate: z.string().optional(),
  cardsYellow: z.number().int().optional(),
  cardsRed: z.number().int().optional(),
  faults: z.number().int().optional(),
  amountGoalsFirstTeam: z.number().int().optional(),
  amountGoalsSecondTeam: z.number().int().optional(),
  winner: z.string().optional(),
  tournamentId: z.string().min(1, "El ID del torneo es requerido"),
});
