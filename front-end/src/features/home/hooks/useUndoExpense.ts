import type { UseMutationResult } from "@tanstack/react-query";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteExpense } from "@/features/home/api/expensesApi";
import {
  annualSummaryKeys,
  expenseCalendarKeys,
  expensesKeys,
  monthlySummaryKeys,
} from "@/libs/queryKeys";

/**
 * Undo hookに渡すparams。
 */
type UseUndoExpenseParams = {
  /** 出費登録日 */
  readonly date: string;
  /** 出費登録月 */
  readonly month: string;
  /** 出費登録年 */
  readonly year: number;
};

/**
 * @description 最後に登録した出費を削除し、関連cacheを更新対象にする。
 * @param params - cache keyに必要な年月日。
 * @returns 出費削除mutation result。
 * @example
 * useUndoExpense({ date: "2026-05-01", month: "2026-05", year: 2026 });
 */
export function useUndoExpense(
  params: UseUndoExpenseParams,
): UseMutationResult<void, Error, string> {
  /** 出費削除後に関連cacheを更新するQueryClient */
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: monthlySummaryKeys.detail(params.month),
        }),
        queryClient.invalidateQueries({ queryKey: expensesKeys.byDate(params.date) }),
        queryClient.invalidateQueries({
          queryKey: expensesKeys.byMonth(params.month),
        }),
        queryClient.invalidateQueries({
          queryKey: expenseCalendarKeys.byMonth(params.month),
        }),
        queryClient.invalidateQueries({
          queryKey: annualSummaryKeys.byYear(params.year),
        }),
      ]);
    },
  });
}
