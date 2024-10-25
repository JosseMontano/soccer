import * as yup from "yup";
export const ClubDTOschema= yup.object({
  name: yup.string().required("el nombre es requerido"),
});