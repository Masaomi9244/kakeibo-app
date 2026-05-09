import type { UseQueryResult } from "@tanstack/react-query";

import { useQuery } from "@tanstack/react-query";

import type { Income } from "@/domains/income";

import { getIncomes } from "@/features/incomes/api/incomesApi";
import { mapListIncomesResponse } from "@/features/incomes/mappers/incomeMapper";
import { incomesKeys } from "@/libs/queryKeys";

/**
 * @description 対象月の収入一覧を取得する。
 * @param month - YYYY-MM形式の対象月。
 * @returns 収入一覧query result。
 * @example
 * useIncomes("2026-05");
 */
export function useIncomes(month: string): UseQueryResult<Income[]> {
  return useQuery({
    queryFn: async () => {
      const response = await getIncomes(month);

      return mapListIncomesResponse(response);
    },
    queryKey: incomesKeys.byMonth(month),
  });
}
