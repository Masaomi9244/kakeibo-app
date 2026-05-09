import type { UseQueryResult } from "@tanstack/react-query";

import { useQuery } from "@tanstack/react-query";

import type { MonthlySummary } from "@/domains/monthlySummary";

import { getMonthlySummary } from "@/features/home/api/monthlySummaryApi";
import { mapMonthlySummaryDto } from "@/features/home/mappers/monthlySummaryMapper";
import { monthlySummaryKeys } from "@/libs/queryKeys";

/**
 * @description 対象月の月次サマリーを取得する。
 * @param month - YYYY-MM形式の対象月。
 * @returns 月次サマリーquery result。
 * @example
 * useMonthlySummary("2026-05");
 */
export function useMonthlySummary(month: string): UseQueryResult<MonthlySummary> {
  return useQuery({
    queryFn: async () => {
      /** 月次サマリー取得APIのresponse */
      const response = await getMonthlySummary(month);

      return mapMonthlySummaryDto(response.monthlySummary);
    },
    queryKey: monthlySummaryKeys.detail(month),
  });
}
