import type { UseQueryResult } from "@tanstack/react-query";

import { useQuery } from "@tanstack/react-query";

import type { FixedCostItem } from "@/features/fixed-costs/domain/fixedCost";

import { getFixedCosts } from "@/features/fixed-costs/api/fixedCostsApi";
import { mapListFixedCostsResponse } from "@/features/fixed-costs/mappers/fixedCostMapper";
import { fixedCostsKeys } from "@/libs/queryKeys";

/**
 * @description 対象月の固定費一覧を取得する。
 * @param month - YYYY-MM形式の対象月。
 * @returns 固定費一覧query result。
 * @example
 * useFixedCosts("2026-05");
 */
export function useFixedCosts(month: string): UseQueryResult<FixedCostItem[]> {
  return useQuery({
    queryFn: async () => {
      /** 固定費一覧取得APIのresponse */
      const response = await getFixedCosts(month);

      return mapListFixedCostsResponse(response);
    },
    queryKey: fixedCostsKeys.byMonth(month),
  });
}
