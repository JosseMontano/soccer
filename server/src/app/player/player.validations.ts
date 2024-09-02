import { z } from 'zod';

export const playerSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(60, "El nombre no puede tener más de 60 caracteres"),
  Ci: z.number().min(6, "El carnet de identidad es requerido").max(10, "El carnet de identidad no puede tener más de 10 numeros"),
});
