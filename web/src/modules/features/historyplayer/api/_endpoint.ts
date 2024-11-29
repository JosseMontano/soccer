import { HistoryplayerDTO } from "./dtos";
import { Historyplayer } from "./responses";

declare global {
  interface EndpointMap {
    "GET /historyplayers": {
      params: never;
      request: never;
      response: Historyplayer[];
    };
    "POST /historyplayers": {
      params: never;
      request: HistoryplayerDTO;
      response: Historyplayer;
    };
    "PUT /historyplayers/:id": {
      params: { id: string };
      request: HistoryplayerDTO;
      response: Historyplayer;
    };
    "DELETE /historyplayers/:id": {
      params: { id: string };
      request: null;
      response: Historyplayer;
    };
  }
}
