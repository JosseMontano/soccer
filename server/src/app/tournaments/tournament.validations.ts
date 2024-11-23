import { z } from "zod";

// Validar las fechas del torneo
export const dateValidation = z
  .string()
  .refine((date) => !isNaN(Date.parse(date)), "La fecha debe ser válida");

// Validación para crear un torneo
export const createTournamentSchema = z
  .object({
    name: z
      .string()
      .min(1, "El nombre del torneo es obligatorio")
      .max(100, "El nombre no puede tener más de 100 caracteres"),
    description: z.string().optional(), // Campo opcional
    dateStart: dateValidation,
    dateEnd: dateValidation,
    formatId: z.string().min(1, "El formato del torneo es obligatorio"),
    finalFormatId: z.string().optional(), // Campo opcional
    categoryId: z.string().min(1, "La categoría del torneo es obligatoria"),
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
export const updateTournamentSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre del torneo es obligatorio")
    .max(100, "El nombre no puede tener más de 100 caracteres")
    .optional(),
  description: z.string().optional(),
  dateStart: dateValidation.optional(),
  dateEnd: dateValidation.optional(),
  formatId: z.string().optional(),
  finalFormatId: z.string().optional(),
  categoryId: z.string().optional(),
  status: z
    .string()
    .optional()
    .refine(
      (status) => !status || ["pendiente", "en curso", "finalizado"].includes(status),
      {
        message: "El estado del torneo no es válido",
      }
    ),
});

// Validar los parámetros de consulta (filtros)
export const queryTournamentSchema = z.object({
  categoryId: z.string().optional(),
  formatId: z.string().optional(),
  dateStart: dateValidation.optional(),
  dateEnd: dateValidation.optional(),
});