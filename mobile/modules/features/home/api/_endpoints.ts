import { Club, Clubget } from "./responses";

declare global {
  interface EndpointMap {
    "GET /clubs": {
      params: never;
      request: never;
      response: Club[];
    };
    "GET /clubs/select": {
      params: never;
      request: never;
      response: Clubget[];
    };

    "GET /clubs/category/:idCategory": {
      params: { idCategory: string };
      request: never;
      response: Club[];
    };
    "DELETE /clubs/:id": {
      params: { id: string };
      request: null;
      response: Club;
    };
  }
}
