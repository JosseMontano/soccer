import * as yup from "yup";
export const GameDTOschema= yup.object({
  firstTeam: yup.string().min(1, "El primer equipo es requerido"),
  secondTeam: yup.string().min(1, "El segundo equipo es requerido"),
  firstDate: yup.string().min(1, "La fecha del primer juego es requerida"),
  secondDate: yup.string().optional(),
  cardsYellow: yup.number().required(),
  cardsRed: yup.number().required(),
  faults: yup.number().required(),
  amountGoalsFirstTeam: yup.number().required(),
  amountGoalsSecondTeam: yup.number().required(),
  winner: yup.string().optional(),
  tournamentId: yup.string().min(1, "El ID del torneo es requerido"),
});