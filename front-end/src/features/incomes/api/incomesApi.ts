import type {
  CreateIncomeRequest,
  DeleteIncomeResponse,
  IncomeResponse,
  ListIncomesResponse,
  UpdateIncomeRequest,
} from "@/features/incomes/api/incomeDto";

import { requestApi } from "@/libs/apiClient";

/**
 * @description 指定月の収入一覧を取得する。
 * @param month - YYYY-MM形式の対象月。
 * @returns 指定月の収入一覧response。
 * @example
 * await getIncomes("2026-05");
 */
export const getIncomes = async (month: string): Promise<ListIncomesResponse> => {
  /** 指定月の収入一覧取得に使うquery string */
  const params = new URLSearchParams({ month });

  return requestApi<ListIncomesResponse>(`/api/incomes?${params.toString()}`);
};

/**
 * @description 収入を新規登録する。
 * @param request - 登録する収入情報。
 * @returns 登録された収入response。
 * @example
 * await createIncome({ amount: 250000, incomeDate: "2026-05-25", memo: "給与", includedInBalance: true });
 */
export const createIncome = async (
  request: CreateIncomeRequest,
): Promise<IncomeResponse> =>
  requestApi<IncomeResponse>("/api/incomes", {
    body: request,
    method: "POST",
  });

/**
 * @description 指定IDの収入を更新する。
 * @param incomeId - 更新対象の収入ID。
 * @param request - 更新する収入情報。
 * @returns 更新された収入response。
 * @example
 * await updateIncome("income-id", { amount: 260000, incomeDate: "2026-05-25", memo: "給与", includedInBalance: true });
 */
export const updateIncome = async (
  incomeId: string,
  request: UpdateIncomeRequest,
): Promise<IncomeResponse> =>
  requestApi<IncomeResponse>(`/api/incomes/${encodeURIComponent(incomeId)}`, {
    body: request,
    method: "PUT",
  });

/**
 * @description 指定IDの収入を削除する。
 * @param incomeId - 削除対象の収入ID。
 * @returns 削除完了後に解決するPromise。
 * @example
 * await deleteIncome("income-id");
 */
export const deleteIncome = async (incomeId: string): Promise<void> => {
  await requestApi<DeleteIncomeResponse>(
    `/api/incomes/${encodeURIComponent(incomeId)}`,
    { method: "DELETE" },
  );
};
