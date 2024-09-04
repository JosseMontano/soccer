export type ApiSuccessResponse<T> = {
    status: 200;
    message: string;
    data: T;
  };
  
  export type ApiErrorResponse = {
    status: 404 | 422 | 401 | 500;
    message: string;
    data: null;
  };
  
  export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;