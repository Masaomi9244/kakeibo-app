/**
 * APIが共通エラーレスポンスとして返すデータ構造。
 */
export type ApiErrorResponse = {
  /** APIエラーの概要メッセージ */
  message: string;
  /** APIエラーの詳細一覧 */
  details?: Array<{
    /** エラー対象のフィールド名 */
    field?: string;
    /** フィールド単位のエラーメッセージ */
    message: string;
  }>;
};

/**
 * @description API通信でHTTPエラーを受け取ったことを表すアプリ共通エラー。
 * @example
 * throw new ApiClientError(400, { message: "Bad request" });
 */
export class ApiClientError extends Error {
  /** APIが返したHTTPステータス */
  readonly status: number;
  /** APIが返したエラー詳細 */
  readonly details?: ApiErrorResponse["details"];

  /**
   * @description HTTPステータスとAPIエラーレスポンスからクライアント用エラーを生成する。
   * @param status - APIが返したHTTPステータス。
   * @param response - APIが返した共通エラーレスポンス。
   * @returns ApiClientErrorインスタンス。
   * @example
   * new ApiClientError(401, { message: "Unauthorized" });
   */
  constructor(status: number, response: ApiErrorResponse) {
    super(response.message);
    this.name = "ApiClientError";
    this.status = status;
    this.details = response.details;
  }
}
