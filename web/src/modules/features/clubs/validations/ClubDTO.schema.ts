import * as yup from "yup";

export const ClubDTOschema = yup.object({
  name: yup.string().required("El nombre es requerido"),
  categoryId: yup.string(),
  logo: yup.mixed(),
});
