import { TournamentFixture } from "./responses";


declare global {
  interface EndpointMap {
    "GET /tournaments/tournamentsPublic": {
      params: never;
      request: never;
      response: TournamentFixture[];
    };
    "POST /games/events/prediction": {
      params: never;
      request: {
        amountVictoriesTeam1: number,
        amountVictoriesTeam2: number
      };
      response: string;
    };
  }
}
