import * as yup from "yup";
export const PlayerDTOschema= yup.object({
  name: yup.string().required("el nombre es requerido"),
  Ci: yup.number().required("el CI es requerido"),
  lastName: yup.string().required("el apellido es requerido"),
  nationality: yup.string().required("la nacionalidad es requerida"),
  age: yup.number().required("la edad es requerida"),
  commet: yup.number().required("el codigo commet es requerido"),
  birthdate: yup.string().required("la fecha de nacimiento es requerida"),
  photo: yup.string().required("la foto es requerida"),
});