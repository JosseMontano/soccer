import * as yup from "yup";
export const LoginDTOschema= yup.object({
  email: yup.string().min(1, "El email es requerdio"),
  password: yup.string().min(1, "La contraseña es requerida"),
});