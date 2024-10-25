import {   ClubDTO } from "./dtos";
import { Club } from "./responses";

declare global {
  interface EndpointMap {
    "GET /clubs": {
      params: never;
      request: never;
      response: Club[];
    };
    "POST /clubs": {
      params: never;
      request: ClubDTO;
      response: Club;
    };
    "PUT /clubs/:id": {
      params: { id: string };
      request: ClubDTO;
      response: Club;
    };
    "DELETE /clubs/:id": {
      params: { id: string };
      request: null;
      response: Club;
    };
  }
}
