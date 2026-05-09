import type { GetExpenseCalendarResponse } from "@/features/calendar/api/expenseCalendarDto";

import { requestApi } from "@/libs/apiClient";

/**
 * カレンダー取得APIへ渡す検索条件。
 */
export type GetExpenseCalendarParams = {
  /** YYYY-MM形式の対象月 */
  readonly month: string;
  /** YYYY-MM-DD形式の選択日 */
  readonly selectedDate: string;
};

/**
 * @description 対象月のカレンダー集計と選択日の出費明細を取得する。
 * @param params - 対象月と選択日。
 * @returns カレンダー取得API response。
 * @example
 * await getExpenseCalendar({ month: "2026-05", selectedDate: "2026-05-06" });
 */
export const getExpenseCalendar = async (
  params: GetExpenseCalendarParams,
): Promise<GetExpenseCalendarResponse> => {
  /** カレンダー取得APIに渡すquery string */
  const searchParams = new URLSearchParams({
    date: params.selectedDate,
    month: params.month,
  });

  return requestApi<GetExpenseCalendarResponse>(
    `/api/expense-calendar?${searchParams.toString()}`,
  );
};
