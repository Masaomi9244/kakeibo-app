import type { ApiErrorResponse } from "./apiError";

import { ApiClientError } from "./apiError";
import { clientEnv } from "./env";

/**
 * APIリクエスト関数に渡すオプション。
 */
type ApiRequestOptions = Omit<RequestInit, "body" | "headers"> & {
  /** API認証に使うBearer token */
  accessToken?: string;
  /** JSONとして送信するrequest body */
  body?: unknown;
  /** 呼び出し元が追加するHTTPヘッダー */
  headers?: HeadersInit;
};

/**
 * APIリクエストのタイムアウト時間。
 */
const API_REQUEST_TIMEOUT_MS = 10_000;

/**
 * APIリクエスト用HTTPヘッダー生成に必要な値。
 */
type HeaderBuildOptions = {
  /** API認証に使うBearer token */
  accessToken: string | undefined;
  /** JSONとして送信するrequest body */
  body: unknown;
  /** 呼び出し元が追加するHTTPヘッダー */
  headers: HeadersInit | undefined;
};

/**
 * APIリクエストへ渡すAbortSignalと後処理。
 */
type RequestSignal = {
  /** fetch完了後に実行する後処理 */
  readonly cleanup: () => void;
  /** fetchへ渡すAbortSignal */
  readonly signal: AbortSignal;
};

/**
 * @description APIリクエストのbodyと認証状態に応じてHTTPヘッダーを組み立てる。
 * @param options - 追加ヘッダー、アクセストークン、body。
 * @returns fetchに渡すHeaders。
 * @example
 * buildHeaders({ accessToken: "token", body: { amount: 100 }, headers: undefined });
 */
const buildHeaders = (options: HeaderBuildOptions): Headers => {
  /** fetchへ渡すHTTPヘッダー */
  const headers = new Headers(options.headers);

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.accessToken !== undefined && options.accessToken !== "") {
    headers.set("Authorization", `Bearer ${options.accessToken}`);
  }

  return headers;
};

/**
 * @description APIリクエストへ渡すAbortSignalを作成する。
 * @param signal - 呼び出し元が指定したAbortSignal。
 * @returns fetchへ渡すAbortSignalとtimer後処理。
 * @example
 * createRequestSignal(undefined);
 */
const createRequestSignal = (signal: AbortSignal | null | undefined): RequestSignal => {
  if (signal !== undefined && signal !== null) {
    return {
      cleanup: () => undefined,
      signal,
    };
  }

  /** APIリクエストをタイムアウトさせるAbortController */
  const controller = new AbortController();
  /** APIリクエストのタイムアウトID */
  const timeoutID = globalThis.setTimeout(() => {
    controller.abort();
  }, API_REQUEST_TIMEOUT_MS);

  return {
    cleanup: () => {
      globalThis.clearTimeout(timeoutID);
    },
    signal: controller.signal,
  };
};

/**
 * @description API境界のHTTP処理と共通エラー変換を担当する。
 * @param path - API base URL以降のパス。
 * @param options - fetchオプション、body、認証トークン。
 * @returns APIレスポンスを指定した型へ変換した値。
 * @example
 * await requestApi<{ ok: boolean }>("/health");
 */
export const requestApi = async <TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> => {
  /** fetch標準optionと共通API client独自option */
  const { accessToken, body, headers, signal, ...requestOptions } = options;
  /** fetchへ渡すAbortSignalと後処理 */
  const requestSignal = createRequestSignal(signal);
  /** fetchへ渡すrequest設定 */
  const requestInit: RequestInit = {
    ...requestOptions,
    headers: buildHeaders({ accessToken, body, headers }),
    signal: requestSignal.signal,
  };

  if (body !== undefined) {
    requestInit.body = JSON.stringify(body);
  }

  try {
    /** APIから返却されたHTTP response */
    const response = await fetch(`${clientEnv.apiBaseUrl}${path}`, requestInit);

    /** API response bodyをJSONとしてparseした値 */
    const data = (await response.json()) as unknown;

    if (!response.ok) {
      throw new ApiClientError(response.status, data as ApiErrorResponse);
    }

    return data as TResponse;
  } finally {
    requestSignal.cleanup();
  }
};
