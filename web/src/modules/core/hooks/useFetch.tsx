import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { API_URL } from "../constants/ENVIRONMENT";
import { ApiErrorResponse, ApiSuccessResponse } from "../types/ApiResponse";
import { toastError } from "@/modules/core/utils/toast";
import { TOKEN_NAME } from "@/modules/core/constants/CONSTANTS";
import { HttpMethod } from "../types/HttpMethod";

//* BUILD URL WITH PARAMS
const buildUrl = (endpoint: string, params?: Record<string, any>): string => {
  let url = endpoint.split(" ")[1];
  if (params) {
    Object.keys(params).forEach((key) => {
      url = url.replace(`:${key}`, params[key as keyof typeof params]);
    });
  }
  return url;
};

//* FETCH ERROR HANDLER
const handleResponse = async <T,>(response: Response): Promise<T> => {
  if (!response.ok) {
    let msg = "Error del servidor";
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_NAME);
    }
    if (response.status !== 500) {
      const error = (await response.json()) as ApiErrorResponse;
      msg = error.message;
    }
    throw new Error(`${response.status}: ` + msg || "Algo salió mal");
  }
  return response.json();
};

const useFetch = () => {
  //* FETCHING IN COMPONENT RENDERING
  const fetchData = <K extends keyof EndpointMap>(
    key: QueryKey,
    endpointConfig: K | [K, EndpointMap[K]["params"]],
    config: RequestInit = {}
  ) => {
    type TResponse = EndpointMap[K]["response"];

    const queryClient = useQueryClient();

    const endpoint: string = Array.isArray(endpointConfig)
      ? endpointConfig[0]
      : endpointConfig;
    const params = Array.isArray(endpointConfig)
      ? endpointConfig[1]
      : undefined;
    const urlBuild = buildUrl(endpoint, params);

    const queryKey = params ? [...key, ...Object.values(params)] : key;

    const returnValue = useQuery<ApiSuccessResponse<TResponse>>({
      queryKey,
      queryFn: async () => {
        const token = localStorage.getItem(TOKEN_NAME);
        const response = await fetch(API_URL + urlBuild, {
          ...config,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...config.headers,
          },
        });
        return handleResponse<ApiSuccessResponse<TResponse>>(response);
      },
      retry: false,
    });

    const setData = (setter: TResponse | ((prev: TResponse) => TResponse)) => {
      if (!returnValue.data) return;
      queryClient.setQueryData(
        queryKey,
        (old: ApiSuccessResponse<TResponse>) => ({
          ...old,
          data: typeof setter === "function" ? setter(old.data) : setter,
        })
      );
    };

    return {
      ...returnValue,
      res: returnValue.data,
      data: returnValue.data?.data,
      setData,
    };
  };

  //* FETCHING IN CODE
  const postData = <K extends keyof EndpointMap>(
    endpointConfig: K | [K, EndpointMap[K]["params"]],
    config: RequestInit = {}
  ) => {
    type TResponse = EndpointMap[K]["response"];
    type TBody = EndpointMap[K]["request"];

    const endpoint: string = Array.isArray(endpointConfig)
      ? endpointConfig[0]
      : endpointConfig;
    const params = Array.isArray(endpointConfig)
      ? endpointConfig[1]
      : undefined;
    const [method] = endpoint.split(" ") as [HttpMethod, string];
    const urlBuild = buildUrl(endpoint, params);

    return useMutation<ApiSuccessResponse<TResponse>, Error, TBody>({
      mutationFn: async (payload: TBody) => {
        const token = localStorage.getItem(TOKEN_NAME);
        const response = await fetch(API_URL + urlBuild, {
          method: method,
          body:
            method === "GET" || method === "DELETE"
              ? undefined
              : JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...config.headers,
          },
          ...config,
        });
        return handleResponse<ApiSuccessResponse<TResponse>>(response);
      },
      onError: (error: Error) => {
        console.error(error.message);
        toastError(error.message);
      },
    });
  };

  return { fetchData, postData };
};

export default useFetch;
