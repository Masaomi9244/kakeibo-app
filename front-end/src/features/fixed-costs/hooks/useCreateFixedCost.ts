import type { UseMutationResult } from "@tanstack/react-query";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateFixedCostRequest } from "@/features/fixed-costs/api/fixedCostDto";
import type { FixedCostItem } from "@/features/fixed-costs/domain/fixedCost";

import { createFixedCost } from "@/features/fixed-costs/api/fixedCostsApi";
import { invalidateFixedCostCaches } from "@/features/fixed-costs/hooks/invalidateFixedCostCaches";
import { mapFixedCostDto } from "@/features/fixed-costs/mappers/fixedCostMapper";

/**
 * 固定費登録hookに渡すparams。
 */
type UseCreateFixedCostParams = {
  /** 固定費登録月 */
  readonly month: string;
  /** 固定費登録年 */
  readonly year: number;
};

/**
 * @description 固定費を登録し、関連cacheを更新対象にする。
 * @param params - cache keyに必要な年月。
 * @returns 固定費登録mutation result。
 * @example
 * useCreateFixedCost({ month: "2026-05", year: 2026 });
 */
export function useCreateFixedCost(
  params: UseCreateFixedCostParams,
): UseMutationResult<FixedCostItem, Error, CreateFixedCostRequest> {
  /** 固定費登録後に関連cacheを更新するQueryClient */
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request) => {
      /** 固定費登録APIのresponse */
      const response = await createFixedCost(request);

      return mapFixedCostDto(response.fixedCost);
    },
    onSuccess: async () => {
      await invalidateFixedCostCaches({ ...params, queryClient });
    },
  });
}
