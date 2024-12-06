import * as yup from "yup";
export const TournamentDTOschema = yup.object({
  name: yup.string().min(1, "El primer equipo es requerido"),
  description: yup.string().min(1, "La descripcion es requerida"),
  dateStart: yup.string().min(1, "La fecha de inicio del torneo es requerida"),
  dateEnd: yup.string().min(1, "La fecha del final de torneo es requerida"),
  formatId: yup
    .string()
    .min(1, "El formato del campeonato es obligatorio")
    .required("El formato del campeonato es obligatorio"),
  finalFormatId: yup
    .string()
    .min(1, "El formato de la final del torneo es obligatorio")
    .required("El formato de la final del torneo es obligatorio"),
  categoryId: yup
    .string()
    .min(1, "La categoría del torneo es obligatoria")
    .required("La categoría del torneo es obligatoria"),
  clubIds: yup
    .array(yup.string().required("Cada club debe tener un ID válido"))
    .min(2, "Debe haber al menos 2 clubes inscritos")
    .required("La lista de clubes es obligatoria")
    .test(
      "is-even",
      "El número de clubes debe ser par",
      (clubIds) => clubIds && clubIds.length % 2 === 0
    ),
});
