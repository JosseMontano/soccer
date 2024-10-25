import { z } from 'zod';

export const tournamentSchema = z.object({
  name: z.string().min(1, "El nombre del torneo es requerido").max(60, "El nombre no puede tener más de 60 caracteres"),
  dateStart: z.string().min(1, "La fecha de inicio es requerida"),
  dateEnd: z.string().min(1, "La fecha de finalización es requerida"),
  formatId: z.string().min(1, "El formato es requerido").optional(),
});