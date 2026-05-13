import type {
  AnnualMonthlySummary,
  AnnualSummaryMonth,
} from "@/features/annual-summary/domain/annualSummary";

/**
 * @description YYYY-MM形式の対象月を月表示ラベルへ変換する。
 * @param month - YYYY-MM形式の対象月。
 * @returns 月表示ラベル。
 * @example
 * formatAnnualSummaryMonthLabel("2026-05");
 */
const formatAnnualSummaryMonthLabel = (month: string): string =>
  `${Number(month.slice(5, 7))}月`;

/**
 * @description APIから取得した月別サマリーを補助表示用の値へ変換する。
 * @param months - APIから取得した月別サマリー一覧。
 * @returns 最多支出月などの補助表示に使う値。
 * @example
 * createAnnualMonthlySummaries([{ month: "2026-05", totalIncome: 315000, availableIncome: 315000, reservedIncome: 0, fixedCostTotal: 95200, expenseTotal: 5960, actualBalance: 213840, availableBalance: 213840 }]);
 */
export const createAnnualMonthlySummaries = (
  months: readonly AnnualSummaryMonth[],
): AnnualMonthlySummary[] =>
  months.map((month) => ({
    actualBalance: month.actualBalance,
    availableIncome: month.availableIncome,
    expense: month.expenseTotal,
    fixedCost: month.fixedCostTotal,
    month: formatAnnualSummaryMonthLabel(month.month),
    remainingBalance: month.availableBalance,
    reservedIncome: month.reservedIncome,
    totalIncome: month.totalIncome,
  }));
