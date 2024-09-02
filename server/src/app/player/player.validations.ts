import { z } from 'zod';



export const playerSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(60, "El nombre no puede tener más de 60 caracteres"),
  Ci: z.number().int().min(1, "El CI es requerido"),
  lastName: z.string().min(1, "El apellido es requerido").max(60, "El apellido no puede tener más de 60 caracteres"),
  nationality: z.string().min(1, "La nacionalidad es requerida").max(60, "La nacionalidad no puede tener más de 60 caracteres"),
  age: z.number().int().min(1, "La edad es requerida"),
  commet: z.number().int().min(1, "El codigo commet es requerido"),
  birthdate: z.string().min(1, "La fecha de nacimiento es requerida"),
  photo: z.string().min(1, "La foto es requerida"),

});
