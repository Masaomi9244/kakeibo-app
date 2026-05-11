import { useMemo } from "react";

import type {
  AnnualSummaryHighlight,
  AnnualSummaryStatCard,
  BarMetric,
  PieMetric,
} from "@/features/annual-summary/domain/annualSummary";

import { useAnnualSummary } from "@/features/annual-summary/hooks/useAnnualSummary";
import { calculateAnnualSummaryTotals } from "@/features/annual-summary/usecases/calculateAnnualSummaryTotals";
import { createAnnualMonthlySummaries } from "@/features/annual-summary/usecases/createAnnualMonthlySummaries";
import {
  createAnnualBreakdownMetrics,
  createMonthlyExpenseTrendMetrics,
} from "@/features/annual-summary/usecases/createAnnualSummaryChartMetrics";
import { createAnnualSummaryStatCards } from "@/features/annual-summary/usecases/createAnnualSummaryStatCards";
import { findHighestExpenseMonth } from "@/features/annual-summary/usecases/findHighestExpenseMonth";
import { formatAsiaTokyoMonth } from "@/libs/date";

/**
 * 年間サマリー画面templateへ渡すview model。
 */
export type AnnualSummaryPageViewModel = {
  /** 年間収支内訳円グラフの指標一覧 */
  readonly annualBreakdownMetrics: readonly PieMetric[];
  /** 年間収支内訳円グラフの見出し */
  readonly annualBreakdownTitle: string;
  /** 年間サマリー取得エラー文言 */
  readonly annualSummaryErrorMessage: string | undefined;
  /** 年間サマリー読み込み中か */
  readonly annualSummaryIsLoading: boolean;
  /** 最多支出月カードに表示する値 */
  readonly highestExpenseMonth: AnnualSummaryHighlight;
  /** 月別出費推移グラフの指標一覧 */
  readonly monthlyTrendMetrics: readonly BarMetric[];
  /** 月別出費推移グラフの見出し */
  readonly monthlyTrendTitle: string;
  /** 統計カード一覧 */
  readonly statCards: readonly AnnualSummaryStatCard[];
};

/**
 * @description 年間サマリー画面の集計値、注目月、グラフ表示値をまとめる。
 * @param なし。
 * @returns 年間サマリー画面templateへ渡すview model。
 * @example
 * const annualSummaryPage = useAnnualSummaryPageViewModel();
 */
export function useAnnualSummaryPageViewModel(): AnnualSummaryPageViewModel {
  /** 今年 */
  const currentYear = useMemo(
    () => Number(formatAsiaTokyoMonth(new Date()).slice(0, 4)),
    [],
  );
  /** 年間サマリー取得query */
  const annualSummaryQuery = useAnnualSummary(currentYear);
  /** APIから取得した年間サマリー */
  const annualSummary = annualSummaryQuery.data;
  /** 最多支出月算出に使う月別表示値一覧 */
  const monthlySummaries =
    annualSummary === undefined
      ? []
      : createAnnualMonthlySummaries(annualSummary.months);
  /** 年間サマリー画面で利用する年間集計値 */
  const annualSummaryTotals =
    annualSummary === undefined
      ? {
          actualBalance: 0,
          availableIncome: 0,
          expense: 0,
          fixedCost: 0,
          remainingBalance: 0,
          reservedIncome: 0,
          totalIncome: 0,
        }
      : calculateAnnualSummaryTotals(annualSummary);
  /** 統計カード一覧 */
  const statCards = createAnnualSummaryStatCards(annualSummaryTotals);
  /** 最多支出月カードに表示する値 */
  const highestExpenseMonth = findHighestExpenseMonth(monthlySummaries);
  /** 月別出費推移グラフの指標一覧 */
  const monthlyTrendMetrics =
    annualSummary === undefined ? [] : createMonthlyExpenseTrendMetrics(annualSummary);
  /** 年間収支内訳円グラフの指標一覧 */
  const annualBreakdownMetrics =
    annualSummary === undefined ? [] : createAnnualBreakdownMetrics(annualSummary);

  return {
    annualBreakdownMetrics,
    annualBreakdownTitle: "年間収支内訳",
    annualSummaryErrorMessage: annualSummaryQuery.isError
      ? annualSummaryQuery.error.message
      : undefined,
    annualSummaryIsLoading: annualSummaryQuery.isLoading,
    highestExpenseMonth,
    monthlyTrendMetrics,
    monthlyTrendTitle: "月別出費推移",
    statCards,
  };
}
