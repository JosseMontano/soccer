import { GameDTO } from "./dtos";
import { Game } from "./responses";

declare global {
  interface EndpointMap {
    "GET /game": {
      params: never;
      request: never;
      response: Game[];
    };
    "POST /game": {
      params: never;
      request: GameDTO;
      response: Game;
    };
    "PUT /game/:id": {
      params: { id: string };
      request: GameDTO;
      response: Game;
    };
    "DELETE /game/:id": {
      params: { id: string };
      request: null;
      response: Game;
    };
  }
}
