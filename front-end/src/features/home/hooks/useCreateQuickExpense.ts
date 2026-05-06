import type { UseMutationResult } from "@tanstack/react-query";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Expense } from "@/domains/expense";

import { createExpense } from "@/features/home/api/expensesApi";
import { mapExpenseDto } from "@/features/home/mappers/expenseMapper";
import {
  annualSummaryKeys,
  expenseCalendarKeys,
  expensesKeys,
  monthlySummaryKeys,
} from "@/libs/queryKeys";

/**
 * クイック出費登録hookに渡すparams。
 */
type UseCreateQuickExpenseParams = {
  readonly date: string;
  readonly month: string;
  readonly year: number;
};

/**
 * @description 出費登録後に影響するホーム、カレンダー、年間サマリーのcacheを更新対象にする。
 * @param params - cache keyに必要な年月日。
 * @returns 出費登録mutation result。
 * @example
 * useCreateQuickExpense({ date: "2026-05-01", month: "2026-05", year: 2026 });
 */
export function useCreateQuickExpense(
  params: UseCreateQuickExpenseParams,
): UseMutationResult<Expense, Error, number> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount) => {
      const response = await createExpense({ amount });

      return mapExpenseDto(response.expense);
    },
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
