import { LoginDTO } from "./dtos";
import { Login } from "./responses";

declare global {
  interface EndpointMap {
    "POST /users/login": {
      params: never;
      request: LoginDTO;
      response: Login;
    };

  }
}
