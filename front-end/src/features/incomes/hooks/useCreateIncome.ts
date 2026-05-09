import type { UseMutationResult } from "@tanstack/react-query";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Income } from "@/domains/income";
import type { CreateIncomeRequest } from "@/features/incomes/api/incomeDto";

import { createIncome } from "@/features/incomes/api/incomesApi";
import { invalidateIncomeCaches } from "@/features/incomes/hooks/invalidateIncomeCaches";
import { mapIncomeDto } from "@/features/incomes/mappers/incomeMapper";

/**
 * 収入登録hookに渡すparams。
 */
type UseCreateIncomeParams = {
  readonly month: string;
  readonly year: number;
};

/**
 * @description 収入を登録し、関連cacheを更新対象にする。
 * @param params - cache keyに必要な年月。
 * @returns 収入登録mutation result。
 * @example
 * useCreateIncome({ month: "2026-05", year: 2026 });
 */
export function useCreateIncome(
  params: UseCreateIncomeParams,
): UseMutationResult<Income, Error, CreateIncomeRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request) => {
      const response = await createIncome(request);

      return mapIncomeDto(response.income);
    },
    onSuccess: async () => {
      await invalidateIncomeCaches({ ...params, queryClient });
    },
  });
}
