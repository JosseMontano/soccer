import {
  MutateOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { API_URL } from "../constants/ENVIRONMENT";
import { ApiErrorResponse, ApiSuccessResponse } from "../types/ApiResponse";
import { TOKEN_NAME } from "@/modules/core/constants/CONSTANTS";
import { HttpMethod } from "../types/HttpMethod";
import { toastError } from "../utils/toast";

export type SetData<T> = (setter: T | ((prev: T) => T)) => void;

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

const useFetch = () => {
  //* FETCH ERROR HANDLER
  const handleResponse = async <T,>(response: Response): Promise<T> => {
    if (!response.ok) {
      let msg = "Error del servidor";
      if (response.status === 401) {
      }
      if (response.status !== 500) {
        const error = (await response.json()) as ApiErrorResponse;
        msg = error.message;
      }
      throw new Error(`${response.status}: ` + msg || "Algo saliÃ³ mal");
    }
    return response.json();
  };

  //* FETCHING IN COMPONENT RENDERING
  const fetchData = <K extends keyof EndpointMap>(
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

    const queryKey = params ? [endpoint, ...Object.values(params)] : [endpoint];

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

    const setData: SetData<TResponse> = (setter) => {
      if (!returnValue.data) return;
      queryClient.setQueryData(
        queryKey,
        (old: ApiSuccessResponse<TResponse>) => ({
          ...old,
          data:
            typeof setter === "function"
              ? setter(old.data as TResponse)
              : setter,
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
    endpointConfig: K,
    config: RequestInit = {}
  ) => {
    type TResponse = EndpointMap[K]["response"];
    type TBody = EndpointMap[K]["request"];
    type TParams = EndpointMap[K]["params"];
    const paramsLocalStorageKey = "useFetchRequestParams";

    const endpoint: string = Array.isArray(endpointConfig)
      ? endpointConfig[0]
      : endpointConfig;
    const [method] = endpoint.split(" ") as [HttpMethod, string];

    const mutation = useMutation<ApiSuccessResponse<TResponse>, Error, TBody>({
      mutationFn: async (payload: TBody) => {
        const parameters = JSON.parse(
          sessionStorage.getItem(paramsLocalStorageKey) || "{}"
        );
        const urlBuild = buildUrl(endpoint, parameters);
        sessionStorage.removeItem(paramsLocalStorageKey);

        const token = localStorage.getItem(TOKEN_NAME);

        let objHeaders: Record<string, any> = {
          Authorization: `Bearer ${token}`,
          ...config.headers,
        }
        if(method !== "GET" && method !== "DELETE") {
          objHeaders["Content-Type"] = "application/json"
        }

        const response = await fetch(API_URL + urlBuild, {
          method: method,
          body:
            method === "GET" || method === "DELETE"
              ? undefined
              : JSON.stringify(payload),
          headers:objHeaders,
          ...config,
        });
        return handleResponse<ApiSuccessResponse<TResponse>>(response);
      },
      onError: (error: Error) => {
        console.error(error.message);
        toastError(error.message);
      },
    });

    interface CustomMutationOptions<T1, T2, T3, T4>
      extends MutateOptions<T1, T2, T3, T4> {
      params?: TParams extends never ? void : TParams;
    }

    const customMutation = (
      variables: TBody,
      options?: CustomMutationOptions<
        ApiSuccessResponse<TResponse>,
        Error,
        TBody,
        unknown
      >
    ) => {
      if (options?.params) {
        sessionStorage.setItem(
          paramsLocalStorageKey,
          JSON.stringify(options.params)
        );
      }
      mutation.mutate(variables, options);
    };

    return customMutation;
  };

  return { fetchData, postData };
};

export default useFetch;
