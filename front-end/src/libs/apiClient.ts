import type { ApiErrorResponse } from "./apiError";

import { ApiClientError } from "./apiError";
import { clientEnv } from "./env";

type ApiRequestOptions = Omit<RequestInit, "body" | "headers"> & {
  accessToken?: string;
  body?: unknown;
  headers?: HeadersInit;
};

type HeaderBuildOptions = {
  accessToken: string | undefined;
  body: unknown;
  headers: HeadersInit | undefined;
};

const buildHeaders = (options: HeaderBuildOptions): Headers => {
  const headers = new Headers(options.headers);

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.accessToken !== undefined && options.accessToken !== "") {
    headers.set("Authorization", `Bearer ${options.accessToken}`);
  }

  return headers;
};

// API境界のHTTP処理と共通エラー変換を担当する。
export const requestApi = async <TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> => {
  const { accessToken, body, headers, ...requestOptions } = options;
  const requestInit: RequestInit = {
    ...requestOptions,
    headers: buildHeaders({ accessToken, body, headers }),
  };

  if (body !== undefined) {
    requestInit.body = JSON.stringify(body);
  }

  const response = await fetch(`${clientEnv.apiBaseUrl}${path}`, requestInit);

  const data = (await response.json()) as unknown;

  if (!response.ok) {
    throw new ApiClientError(response.status, data as ApiErrorResponse);
  }

  return data as TResponse;
};
