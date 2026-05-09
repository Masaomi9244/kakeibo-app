import type { GetMonthlySummaryResponse } from "@/features/home/api/monthlySummaryDto";

import { requestApi } from "@/libs/apiClient";

/**
 * @description 指定月の月次サマリーを取得する。
 * @param month - YYYY-MM形式の対象月。
 * @returns 月次サマリーresponse。
 * @example
 * await getMonthlySummary("2026-05");
 */
export const getMonthlySummary = async (
  month: string,
): Promise<GetMonthlySummaryResponse> => {
  /** 指定月の月次サマリー取得に使うquery string */
  const params = new URLSearchParams({ month });

  return requestApi<GetMonthlySummaryResponse>(
    `/api/monthly-summary?${params.toString()}`,
  );
};
