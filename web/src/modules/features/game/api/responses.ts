import { Team } from "../../tournament/api/responses";

export interface Game {
  id: string;
  firstTeam: Team;
  secondTeam: Team;
  firstDate: string;
  secondDate?: string;
  cardsYellow?: number;
  cardsRed?: number;
  faults?: number;
  amountGoalsFirstTeam?: number;
  amountGoalsSecondTeam?: number;
  winner?: string;
  tournamentId: string;
}
