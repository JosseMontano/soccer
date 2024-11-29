import { Category } from "./responses";

declare global {
  interface EndpointMap {
    "GET /categories": {
      params: never;
      request: never;
      response: Category[];
    };
  }
}
