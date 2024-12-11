import { TournamentFixture } from "./responses";


declare global {
  interface EndpointMap {
    "GET /tournaments/tournamentsPublic": {
      params: never;
      request: never;
      response: TournamentFixture[];
    };
  }
}
