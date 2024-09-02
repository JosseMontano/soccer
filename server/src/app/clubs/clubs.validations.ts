import { z } from 'zod';

export const clubSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(60, "El nombre no puede tener más de 60 caracteres"),
});
