import type {
  AnnualSummary,
  AnnualSummaryTotals,
} from "@/features/annual-summary/domain/annualSummary";

/**
 * @description APIから取得した年間集計を統計カード用の年間集計値へ変換する。
 * @param annualSummary - APIから取得した年間サマリー。
 * @returns 年間サマリー画面で利用する年間集計値。
 * @example
 * calculateAnnualSummaryTotals(annualSummary);
 */
export function calculateAnnualSummaryTotals(
  annualSummary: AnnualSummary,
): AnnualSummaryTotals {
  return {
    actualBalance: annualSummary.actualBalance,
    availableIncome: annualSummary.availableIncome,
    expense: annualSummary.expenseTotal,
    fixedCost: annualSummary.fixedCostTotal,
    remainingBalance: annualSummary.availableBalance,
    reservedIncome: annualSummary.reservedIncome,
    totalIncome: annualSummary.totalIncome,
  };
}
