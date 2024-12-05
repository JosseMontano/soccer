import * as yup from "yup";
export const PlayerDTOschema= yup.object({
  name: yup.string().required("el nombre es requerido"),
  lastName: yup.string().required("el apellido es requerido"),
  nationality: yup.string().required("la nacionalidad es requerida"),
  commet: yup.string().required("el codigo commet es requerido"),
  birthdate: yup.string().required("la fecha de nacimiento es requerida"),
  photo: yup.string().required("la foto es requerida"),
  gender : yup.string().required("el genero es requerido"),
  clubId: yup.string().required("el club es requerido"),
});