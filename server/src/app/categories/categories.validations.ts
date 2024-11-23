import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "El nombre de la categoría es requerido").max(50, "El nombre no puede exceder 50 caracteres"),
  typeCategoryId: z.string().min(1, "El tipo de categoría es requerido"),
  minAge: z.number().min(0, "La edad mínima debe ser mayor o igual a 0"),
  maxAge: z.number().min(1, "La edad máxima debe ser mayor que la mínima"),
});