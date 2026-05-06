import type { UseQueryResult } from "@tanstack/react-query";

import { useQuery } from "@tanstack/react-query";

import type { Expense } from "@/domains/expense";

import { getExpensesByDate } from "@/features/home/api/expensesApi";
import { mapListExpensesResponse } from "@/features/home/mappers/expenseMapper";
import { expensesKeys } from "@/libs/queryKeys";

/**
 * @description Asia/Tokyo基準の対象日に登録された出費一覧を取得する。
 * @param date - YYYY-MM-DD形式の対象日。
 * @returns 出費一覧query result。
 * @example
 * useTodayExpenses("2026-05-01");
 */
export function useTodayExpenses(date: string): UseQueryResult<Expense[]> {
  return useQuery({
    queryFn: async () => {
      const response = await getExpensesByDate(date);

      return mapListExpensesResponse(response);
    },
    queryKey: expensesKeys.byDate(date),
  });
}
