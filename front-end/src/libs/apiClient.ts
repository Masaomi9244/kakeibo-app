import { ApiClientError, type ApiErrorResponse } from "./apiError";
import { clientEnv } from "./env";

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  accessToken?: string;
};

const buildHeaders = (options: ApiRequestOptions): Headers => {
  const headers = new Headers(options.headers);

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.accessToken) {
    headers.set("Authorization", `Bearer ${options.accessToken}`);
  }

  return headers;
};

// API境界のHTTP処理と共通エラー変換を担当する。
export const requestApi = async <TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> => {
  const response = await fetch(`${clientEnv.apiBaseUrl}${path}`, {
    ...options,
    headers: buildHeaders(options),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const data = (await response.json()) as unknown;

  if (!response.ok) {
    throw new ApiClientError(response.status, data as ApiErrorResponse);
  }

  return data as TResponse;
};
