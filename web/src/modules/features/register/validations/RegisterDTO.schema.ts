import * as yup from "yup";

export const RegisterDTOschema = yup.object().shape({
  email: yup.string().email("Email inválido").required("El email es requerido"),
  password: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es requerida"),
});
