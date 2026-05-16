import type {
  AnnualSummaryStatCard,
  AnnualSummaryTotals,
} from "@/features/annual-summary/domain/annualSummary";

/**
 * @description 年間集計値から統計カード表示用の値一覧を作成する。
 * @param totals - 年間サマリー画面で利用する年間集計値。
 * @returns 年間サマリー画面の統計カード一覧。
 * @example
 * createAnnualSummaryStatCards(totals);
 */
export function createAnnualSummaryStatCards(
  totals: AnnualSummaryTotals,
): readonly AnnualSummaryStatCard[] {
  return [
    {
      amount: totals.totalIncome,
      emphasized: false,
      id: "total-income",
      label: "年間全収入",
      tone: "income",
    },
    {
      amount: totals.fixedCost,
      emphasized: false,
      id: "fixed-cost",
      label: "年間固定費",
      tone: "fixedCost",
    },
    {
      amount: totals.expense,
      emphasized: false,
      id: "expense",
      label: "年間変動費",
      tone: "expense",
    },
    {
      amount: totals.actualBalance,
      emphasized: true,
      id: "actual-balance",
      label: "年間実収支",
      tone: "default",
    },
  ];
}
