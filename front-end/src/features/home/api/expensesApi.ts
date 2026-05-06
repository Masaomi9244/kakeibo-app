import type {
  CreateExpenseRequest,
  CreateExpenseResponse,
  ListExpensesResponse,
} from "@/features/home/api/expenseDto";

import { requestApi } from "@/libs/apiClient";

/**
 * @description 金額だけで出費を登録する。
 * @param request - 登録する出費金額。
 * @returns 登録された出費DTOを含むresponse。
 * @example
 * await createExpense({ amount: 780 });
 */
export const createExpense = async (
  request: CreateExpenseRequest,
): Promise<CreateExpenseResponse> =>
  requestApi<CreateExpenseResponse>("/api/expenses", {
    body: request,
    method: "POST",
  });

/**
 * @description 指定日の出費一覧を取得する。
 * @param date - YYYY-MM-DD形式の対象日。
 * @returns 指定日の出費一覧response。
 * @example
 * await getExpensesByDate("2026-05-01");
 */
export const getExpensesByDate = async (
  date: string,
): Promise<ListExpensesResponse> => {
  const params = new URLSearchParams({ date });

  return requestApi<ListExpensesResponse>(`/api/expenses?${params.toString()}`);
};

/**
 * @description 指定IDの出費を削除する。
 * @param expenseId - 削除対象の出費ID。
 * @returns 削除完了後に解決するPromise。
 * @example
 * await deleteExpense("expense-id");
 */
export const deleteExpense = async (expenseId: string): Promise<void> => {
  await requestApi<{ readonly message: string }>(
    `/api/expenses/${encodeURIComponent(expenseId)}`,
    { method: "DELETE" },
  );
};
