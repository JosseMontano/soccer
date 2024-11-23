import { z } from "zod";

export const historyPlayerSchema = z.object({
  playerId: z.string().min(1, "El ID del jugador es requerido"),
  clubId: z.string().min(1, "El ID del club es requerido"),
  typeOfPassId: z.string().min(1, "El ID del tipo de pase es requerido"),
  active: z.boolean(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), "La fecha de inicio debe ser válida"),
  endDate: z.string().optional().refine((date) => date === undefined ||!isNaN(Date.parse(date)), "La fecha de fin debe ser válida"),
  goals: z.number().min(0, "Los goles deben ser un número no negativo").optional(),
  yellowCards: z.number().min(0, "Las tarjetas amarillas deben ser un número no negativo").optional(),
  redCards: z.number().min(0, "Las tarjetas rojas deben ser un número no negativo").optional(),
  matchesPlayed: z.number().min(0, "Los partidos jugados deben ser un número no negativo").optional(),
});