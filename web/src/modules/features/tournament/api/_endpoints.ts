import { Game } from "../../game/api/responses";
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
      response: Tournament;
    };
    "PUT /tournaments/:id/edit-fixture": {
      params: { id: string };
      request: {
        id: string;
        date: string;
      }[];
      response: Tournament;
    };
    "PUT /games/events/:gameId/finish": {
      params: { gameId: string };
      request: null;
      response: Game;
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
