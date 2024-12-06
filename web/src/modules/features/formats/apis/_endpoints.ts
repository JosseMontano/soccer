import { Format } from "./responses";

declare global {
  interface EndpointMap {
    "GET /formats": {
      params: never;
      request: never;
      response: Format[];
    };
  }
}
