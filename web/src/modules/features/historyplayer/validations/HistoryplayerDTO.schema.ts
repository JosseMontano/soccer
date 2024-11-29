import * as yup from "yup";
export const HistoryplayerDTOschema= yup.object({
  club: yup.string().required("El nombre del club es requerido"),
  allGoals: yup.number().required("Los goles del jugador es requerido"),
  allFaults: yup.number().required("Las faltas del jugador es requerido"),
  allYellowCard: yup.number().required("Las tarjetas amarillas son requeridas"),
  allRedCard: yup.number().required("Las tarjetas rojas son requeridas"),
});