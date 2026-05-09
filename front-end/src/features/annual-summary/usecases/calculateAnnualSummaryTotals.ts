import type {
  AnnualMonthlySummary,
  AnnualSummaryTotals,
} from "@/features/annual-summary/domain/annualSummary";

/**
 * @description 月別サマリー一覧から年間サマリーの集計値を算出する。
 * @param summaries - 月別サマリー一覧。
 * @returns 年間サマリー画面で利用する年間集計値。
 * @example
 * calculateAnnualSummaryTotals(monthlySummaries);
 */
export function calculateAnnualSummaryTotals(
  summaries: readonly AnnualMonthlySummary[],
): AnnualSummaryTotals {
  /** 年間全収入 */
  const totalIncome = summaries.reduce(
    (total, summary) => total + summary.totalIncome,
    0,
  );
  /** 年間使える収入 */
  const availableIncome = summaries.reduce(
    (total, summary) => total + summary.availableIncome,
    0,
  );
  /** 年間貯める収入 */
  const reservedIncome = summaries.reduce(
    (total, summary) => total + summary.reservedIncome,
    0,
  );
  /** 年間固定費 */
  const fixedCost = summaries.reduce((total, summary) => total + summary.fixedCost, 0);
  /** 年間出費 */
  const expense = summaries.reduce((total, summary) => total + summary.expense, 0);
  /** 年間実収支 */
  const actualBalance = totalIncome - fixedCost - expense;
  /** 年間生活費残り */
  const remainingBalance = availableIncome - fixedCost - expense;

  return {
    actualBalance,
    availableIncome,
    expense,
    fixedCost,
    remainingBalance,
    reservedIncome,
    totalIncome,
  };
}
