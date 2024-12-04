import { z } from "zod";

export const userSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .max(50, "El correo no puede exceder 50 caracteres")
    .email("El correo electrónico no es válido")
    .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "El correo debe ser una dirección de Gmail"),
});

export const loginSchema = z.object({
  email: z.string().email("Correo electrónico no válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});