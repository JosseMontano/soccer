import { PlayerDTO } from "./dtos";
import { Player } from "./responses";

declare global {
  interface EndpointMap {
    "GET /players": {
      params: never;
      request: never;
      response: Player[];
    };
    "POST /players": {
      params: never;
      request: PlayerDTO;
      response: Player;
    };
    "PUT /players/:id": {
      params: { id: string };
      request: PlayerDTO;
      response: Player;
    };
    "DELETE /players/:id": {
      params: { id: string };
      request: never;
      response: Player;
    };
  }
}
