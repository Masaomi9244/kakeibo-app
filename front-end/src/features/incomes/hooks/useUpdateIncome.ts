import type { UseMutationResult } from "@tanstack/react-query";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Income } from "@/domains/income";
import type { UpdateIncomeRequest } from "@/features/incomes/api/incomeDto";

import { updateIncome } from "@/features/incomes/api/incomesApi";
import { invalidateIncomeCaches } from "@/features/incomes/hooks/invalidateIncomeCaches";
import { mapIncomeDto } from "@/features/incomes/mappers/incomeMapper";

/**
 * 収入更新mutationに渡すvariables。
 */
export type UpdateIncomeVariables = {
  /** 更新対象の収入ID */
  readonly id: string;
  /** 更新する収入情報 */
  readonly request: UpdateIncomeRequest;
};

/**
 * 収入更新hookに渡すparams。
 */
type UseUpdateIncomeParams = {
  /** 収入更新月 */
  readonly month: string;
  /** 収入更新年 */
  readonly year: number;
};

/**
 * @description 収入を更新し、関連cacheを更新対象にする。
 * @param params - cache keyに必要な年月。
 * @returns 収入更新mutation result。
 * @example
 * useUpdateIncome({ month: "2026-05", year: 2026 });
 */
export function useUpdateIncome(
  params: UseUpdateIncomeParams,
): UseMutationResult<Income, Error, UpdateIncomeVariables> {
  /** 収入更新後に関連cacheを更新するQueryClient */
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      /** 収入更新APIのresponse */
      const response = await updateIncome(variables.id, variables.request);

      return mapIncomeDto(response.income);
    },
    onSuccess: async () => {
      await invalidateIncomeCaches({ ...params, queryClient });
    },
  });
}
