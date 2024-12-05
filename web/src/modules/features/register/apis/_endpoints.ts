import { RegisterDTO } from "./dtos";
import { RegisterResponse } from "./responses";

declare global {
  interface EndpointMap {
    "POST /users/register": {
      params: never;
      request: RegisterDTO;
      response: RegisterResponse;
    };
  }
}
