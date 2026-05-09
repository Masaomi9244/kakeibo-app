import { useMemo } from "react";

import type {
  AnnualMonthlySummary,
  AnnualSummaryHighlight,
  AnnualSummaryStatCard,
  BarMetric,
} from "@/features/annual-summary/domain/annualSummary";

import { calculateAnnualSummaryTotals } from "@/features/annual-summary/usecases/calculateAnnualSummaryTotals";
import { createAnnualSummaryStatCards } from "@/features/annual-summary/usecases/createAnnualSummaryStatCards";
import { findHighestExpenseMonth } from "@/features/annual-summary/usecases/findHighestExpenseMonth";
import { getAnnualSummaryMockData } from "@/features/annual-summary/usecases/getAnnualSummaryMockData";

/**
 * 年間サマリー画面templateへ渡すview model。
 */
export type AnnualSummaryPageViewModel = {
  /** 収支内訳グラフの指標一覧 */
  readonly chartMetrics: readonly BarMetric[];
  /** 収支内訳グラフの見出し */
  readonly chartTitle: string;
  /** 最多支出月カードに表示する値 */
  readonly highestExpenseMonth: AnnualSummaryHighlight;
  /** 月別サマリー一覧 */
  readonly monthlySummaries: readonly AnnualMonthlySummary[];
  /** 画面見出しの補足文 */
  readonly subtitle: string;
  /** 統計カード一覧 */
  readonly statCards: readonly AnnualSummaryStatCard[];
  /** 画面見出し */
  readonly title: string;
};

/**
 * @description 年間サマリー画面の集計値、注目月、グラフ表示値をまとめる。
 * @param なし。
 * @returns 年間サマリー画面templateへ渡すview model。
 * @example
 * const annualSummaryPage = useAnnualSummaryPageViewModel();
 */
export function useAnnualSummaryPageViewModel(): AnnualSummaryPageViewModel {
  /** 年間サマリー画面に表示するモックデータ */
  const annualSummaryMockData = useMemo(() => getAnnualSummaryMockData(), []);
  /** 年間サマリー画面で利用する年間集計値 */
  const annualSummaryTotals = calculateAnnualSummaryTotals(
    annualSummaryMockData.monthlySummaries,
  );
  /** 統計カード一覧 */
  const statCards = createAnnualSummaryStatCards(annualSummaryTotals);
  /** 最多支出月カードに表示する値 */
  const highestExpenseMonth = findHighestExpenseMonth(
    annualSummaryMockData.monthlySummaries,
  );

  return {
    chartMetrics: annualSummaryMockData.chartMetrics,
    chartTitle: "5月の収支内訳",
    highestExpenseMonth,
    monthlySummaries: annualSummaryMockData.monthlySummaries,
    statCards,
    subtitle: "年間の収支をざっくり確認する",
    title: "2026年 年間サマリー",
  };
}
