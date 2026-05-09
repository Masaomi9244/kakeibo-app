import type { QueryClient } from "@tanstack/react-query";

import {
  annualSummaryKeys,
  expenseCalendarKeys,
  fixedCostsKeys,
  monthlySummaryKeys,
} from "@/libs/queryKeys";

/**
 * 固定費mutation後のcache invalidationに必要な値。
 */
export type FixedCostCacheInvalidationParams = {
  /** cacheを更新する対象月 */
  readonly month: string;
  /** cache更新に使うQueryClient */
  readonly queryClient: QueryClient;
  /** cacheを更新する対象年 */
  readonly year: number;
};

/**
 * @description 固定費変更後に影響する固定費一覧、月次サマリー、カレンダー、年間サマリーを更新対象にする。
 * @param params - query clientと対象年月。
 * @returns cache invalidationの完了を待つPromise。
 * @example
 * await invalidateFixedCostCaches({ queryClient, month: "2026-05", year: 2026 });
 */
export const invalidateFixedCostCaches = async (
  params: FixedCostCacheInvalidationParams,
): Promise<void> => {
  await Promise.all([
    params.queryClient.invalidateQueries({
      queryKey: fixedCostsKeys.byMonth(params.month),
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
