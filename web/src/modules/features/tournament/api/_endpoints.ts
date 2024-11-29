import { TournamentDTO } from "./dtos";
import { Tournament } from "./responses";

declare global {
  interface EndpointMap {
    "GET /tournament": {
      params: never;
      request: never;
      response: Tournament[];
    };
    "POST /tournament": {
      params: never;
      request: TournamentDTO;
      response: Tournament;
    };
    "PUT /tournament/:id": {
      params: { id: string };
      request: TournamentDTO;
      response: Tournament;
    };
    "DELETE /tournament/:id": {
      params: { id: string };
      request: null;
      response: Tournament;
    };
  }
}
