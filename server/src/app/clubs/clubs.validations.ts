import { z } from "zod";

export const clubSchema = z.object({
  name: z.string().min(1, "El nombre del club es requerido").max(50, "El nombre no puede exceder 50 caracteres"),
  logo: z.string().optional(), // Logo opcional
  categoryId: z.string().min(1,"El id de la categoria debe ser un uuid valido")
});