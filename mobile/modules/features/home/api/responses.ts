export interface Player{
  id: string
  name: string
  lastName: string
  age: number
  gender: string
  birthdate: string
  commet: string
  nationality: string
  photo: string
  clubId : string
}
export interface Team {
  id: string;
  name: string;
  logo: string;
  players: Player[];
  amountVictories: number; 
  history: TeamHistoryGame[]; 
}
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

export interface TeamHistoryGame {
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
  };
  secondTeam: {
    id: string;
    name: string; 
    logo: string;
  };
}

export interface Game{
  
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

    firstTeam: Team;
    secondTeam: Team;
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
  games: Game[];
}
