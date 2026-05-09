import type { QueryClient } from "@tanstack/react-query";

import {
  annualSummaryKeys,
  expenseCalendarKeys,
  incomesKeys,
  monthlySummaryKeys,
} from "@/libs/queryKeys";

/**
 * 収入mutation後のcache invalidationに必要な値。
 */
export type IncomeCacheInvalidationParams = {
  readonly month: string;
  readonly queryClient: QueryClient;
  readonly year: number;
};

/**
 * @description 収入変更後に影響する収入一覧、月次サマリー、カレンダー、年間サマリーを更新対象にする。
 * @param params - query clientと対象年月。
 * @returns cache invalidationの完了を待つPromise。
 * @example
 * await invalidateIncomeCaches({ queryClient, month: "2026-05", year: 2026 });
 */
export const invalidateIncomeCaches = async (
  params: IncomeCacheInvalidationParams,
): Promise<void> => {
  await Promise.all([
    params.queryClient.invalidateQueries({
      queryKey: incomesKeys.byMonth(params.month),
    }),
    params.queryClient.invalidateQueries({
      queryKey: monthlySummaryKeys.detail(params.month),
    }),
    params.queryClient.invalidateQueries({
      queryKey: expenseCalendarKeys.byMonth(params.month),
    }),
    params.queryClient.invalidateQueries({
      queryKey: annualSummaryKeys.byYear(params.year),
    }),
  ]);
};
