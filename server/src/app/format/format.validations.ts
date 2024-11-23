import { z } from "zod";

// Validación para la creación de un nuevo formato
export const createFormatSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre del formato debe tener al menos 3 caracteres")
    .max(50, "El nombre del formato no puede tener más de 50 caracteres"),
});

// Validación para el ID de un formato (puede usarse para endpoints que requieran un ID)
export const formatIdSchema = z.object({
  id: z.string().min(1, "El ID del formato es obligatorio"),
});

// Validación para la consulta de filtros de formatos (opcional si necesitamos filtrar por criterios)
export const getFormatsSchema = z.object({
  name: z.string().optional(), // Si en el futuro queremos filtrar por nombre
});