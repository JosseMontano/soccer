import * as yup from "yup";
export const TournamentDTOschema = yup.object({
  name: yup.string().min(1, "El primer equipo es requerido"),
  dateStart: yup.number().min(1, "El segundo equipo es requerido"),
  dateEnd: yup.number().min(1, "La fecha del primer juego es requerida"),
  format: yup.string().required(),
});
