import type { UseMutationResult } from "@tanstack/react-query";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteIncome } from "@/features/incomes/api/incomesApi";
import { invalidateIncomeCaches } from "@/features/incomes/hooks/invalidateIncomeCaches";

/**
 * 収入削除hookに渡すparams。
 */
type UseDeleteIncomeParams = {
  /** 収入削除月 */
  readonly month: string;
  /** 収入削除年 */
  readonly year: number;
};

/**
 * @description 収入を削除し、関連cacheを更新対象にする。
 * @param params - cache keyに必要な年月。
 * @returns 収入削除mutation result。
 * @example
 * useDeleteIncome({ month: "2026-05", year: 2026 });
 */
export function useDeleteIncome(
  params: UseDeleteIncomeParams,
): UseMutationResult<void, Error, string> {
  /** 収入削除後に関連cacheを更新するQueryClient */
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteIncome,
    onSuccess: async () => {
      await invalidateIncomeCaches({ ...params, queryClient });
    },
  });
}
