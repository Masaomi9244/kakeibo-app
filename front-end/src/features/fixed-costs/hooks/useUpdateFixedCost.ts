import type { UseMutationResult } from "@tanstack/react-query";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateFixedCostRequest } from "@/features/fixed-costs/api/fixedCostDto";
import type { FixedCostItem } from "@/features/fixed-costs/domain/fixedCost";

import { updateFixedCost } from "@/features/fixed-costs/api/fixedCostsApi";
import { invalidateFixedCostCaches } from "@/features/fixed-costs/hooks/invalidateFixedCostCaches";
import { mapFixedCostDto } from "@/features/fixed-costs/mappers/fixedCostMapper";

/**
 * 固定費更新mutationに渡すvariables。
 */
export type UpdateFixedCostVariables = {
  /** 更新対象の固定費ID */
  readonly id: string;
  /** 更新する固定費情報 */
  readonly request: UpdateFixedCostRequest;
};

/**
 * 固定費更新hookに渡すparams。
 */
type UseUpdateFixedCostParams = {
  /** 固定費更新月 */
  readonly month: string;
  /** 固定費更新年 */
  readonly year: number;
};

/**
 * @description 固定費を更新し、関連cacheを更新対象にする。
 * @param params - cache keyに必要な年月。
 * @returns 固定費更新mutation result。
 * @example
 * useUpdateFixedCost({ month: "2026-05", year: 2026 });
 */
export function useUpdateFixedCost(
  params: UseUpdateFixedCostParams,
): UseMutationResult<FixedCostItem, Error, UpdateFixedCostVariables> {
  /** 固定費更新後に関連cacheを更新するQueryClient */
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      /** 固定費更新APIのresponse */
      const response = await updateFixedCost(variables.id, variables.request);

      return mapFixedCostDto(response.fixedCost);
    },
    onSuccess: async () => {
      await invalidateFixedCostCaches({ ...params, queryClient });
    },
  });
}
