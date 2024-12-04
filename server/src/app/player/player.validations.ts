import { z } from "zod";

export const playerSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre del jugador es requerido")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  lastName: z
    .string()
    .min(1, "El apellido del jugador es requerido")
    .max(50, "El apellido no puede exceder 50 caracteres"),
  nationality: z.string().optional(),
  birthdate: z
    .string()
    .refine(
      (date) => !isNaN(Date.parse(date)),
      "La fecha de nacimiento debe ser válida"
    ),
  gender: z.enum(["male", "female"], {
    required_error: "el genero es requerido",
    invalid_type_error: "el genero debe ser male o female",
  }),
  photo: z.string().optional(),
  clubId: z.string().min(1, "El ID del club es requerido"),
  commet: z.string().optional(),
});
