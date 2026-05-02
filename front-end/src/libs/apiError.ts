export type ApiErrorResponse = {
  message: string;
  details?: {
    field?: string;
    message: string;
  }[];
};

export class ApiClientError extends Error {
  readonly status: number;
  readonly details?: ApiErrorResponse["details"];

  constructor(status: number, response: ApiErrorResponse) {
    super(response.message);
    this.name = "ApiClientError";
    this.status = status;
    this.details = response.details;
  }
}
