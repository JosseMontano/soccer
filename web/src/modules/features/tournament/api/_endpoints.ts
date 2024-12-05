import { TournamentDTO } from "./dtos";
import { Tournament } from "./responses";

declare global {
  interface EndpointMap {
    "GET /tournaments": {
      params: never;
      request: never;
      response: Tournament[];
    };
    "POST /tournaments": {
      params: never;
      request: TournamentDTO;
      response: Tournament;
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
