export interface RegisterResponse {
  message: string;
  data: {
    id: string;
    email: string;
    roleId: string;
  };
}
