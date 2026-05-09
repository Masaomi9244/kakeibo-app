import type { GetAnnualSummaryResponse } from "@/features/annual-summary/api/annualSummaryDto";

import { requestApi } from "@/libs/apiClient";

/**
 * @description 対象年の年間サマリーを取得する。
 * @param year - 対象年。
 * @returns 年間サマリー取得API response。
 * @example
 * await getAnnualSummary(2026);
 */
export const getAnnualSummary = async (
  year: number,
): Promise<GetAnnualSummaryResponse> => {
  /** 年間サマリー取得APIに渡すquery string */
  const params = new URLSearchParams({ year: year.toString() });

  return requestApi<GetAnnualSummaryResponse>(
    `/api/annual-summary?${params.toString()}`,
  );
};
