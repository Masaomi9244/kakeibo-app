import type { UseMutationResult } from "@tanstack/react-query";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteFixedCost } from "@/features/fixed-costs/api/fixedCostsApi";
import { invalidateFixedCostCaches } from "@/features/fixed-costs/hooks/invalidateFixedCostCaches";

/**
 * 固定費削除hookに渡すparams。
 */
type UseDeleteFixedCostParams = {
  /** 固定費削除月 */
  readonly month: string;
  /** 固定費削除年 */
  readonly year: number;
};

/**
 * @description 固定費を削除し、関連cacheを更新対象にする。
 * @param params - cache keyに必要な年月。
 * @returns 固定費削除mutation result。
 * @example
 * useDeleteFixedCost({ month: "2026-05", year: 2026 });
 */
export function useDeleteFixedCost(
  params: UseDeleteFixedCostParams,
): UseMutationResult<void, Error, string> {
  /** 固定費削除後に関連cacheを更新するQueryClient */
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFixedCost,
    onSuccess: async () => {
      await invalidateFixedCostCaches({ ...params, queryClient });
    },
  });
}
