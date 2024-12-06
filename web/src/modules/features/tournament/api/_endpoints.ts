import { TournamentDTO } from "./dtos";
import { Tournament, TournamentFixture } from "./responses";

declare global {
  interface EndpointMap {
    "GET /tournaments": {
      params: never;
      request: never;
      response: Tournament[];
    };
    "GET /tournaments/tournamentsPublic": {
      params: never;
      request: never;
      response: TournamentFixture[];
    };
    "POST /tournaments": {
      params: never;
      request: TournamentDTO;
      response: Tournament;
    };
    "POST /tournaments/:id/generate-fixture": {
      params: { id: string };
      request: null;
      response: {count:number};
    };
    "PUT /tournaments/:id": {
      params: { id: string };
      request: TournamentDTO;
      response: Tournament;
    };
    "DELETE /tournaments/:id": {
      params: { id: string };
      request: null;
      response: Tournament;
    };
  }
}
