import type { UseQueryResult } from "@tanstack/react-query";

import { useQuery } from "@tanstack/react-query";

import type { AnnualSummary } from "@/features/annual-summary/domain/annualSummary";

import { getAnnualSummary } from "@/features/annual-summary/api/annualSummaryApi";
import { mapGetAnnualSummaryResponse } from "@/features/annual-summary/mappers/annualSummaryMapper";
import { annualSummaryKeys } from "@/libs/queryKeys";

/**
 * @description 対象年の年間サマリーを取得する。
 * @param year - 対象年。
 * @returns 年間サマリーquery result。
 * @example
 * useAnnualSummary(2026);
 */
export function useAnnualSummary(year: number): UseQueryResult<AnnualSummary> {
  return useQuery({
    queryFn: async () => {
      /** 年間サマリー取得APIのresponse */
      const response = await getAnnualSummary(year);

      return mapGetAnnualSummaryResponse(response);
    },
    queryKey: annualSummaryKeys.byYear(year),
  });
}
