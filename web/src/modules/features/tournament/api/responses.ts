import { Player } from "../../players/api/responses";

export interface Tournament {
  id: string;
  name: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  formatId: string;
  finalFormatId: string;
  categoryId: string;
  status: string;
  fixtureGenerated: boolean;
}
export interface TournamentFixture {
  id: string;
  name: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  formatId: string;
  finalFormatId: string;
  categoryId: string;
  status: string;
  fixtureGenerated: boolean;
  games: {
    id: string;
    firstTeamId: string;
    secondTeamId: string;
    tournamentId: string;
    date: string;
    goalsFirstTeam: number;
    goalsSecondTeam: number;
    yellowCardsFirstTeam: number;
    yellowCardsSecondTeam: number;
    redCardsFirstTeam: number;
    redCardsSecondTeam: number;
    foulsFirstTeam: number;
    foulsSecondTeam: number;
    winnerId: string | null;

    firstTeam: {
      id: string;
      name: string;
      logo: string;
      players: Player[]
    };
    secondTeam: {
      id: string;
      name: string;
      logo: string;
      players: Player[]
    };
  }[];
}
