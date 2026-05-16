import type { AnnualMonthlySummary } from "@/features/annual-summary/domain/annualSummary";

/**
 * 最も変動費が多かった月の表示値。
 */
export type HighestExpenseMonth = {
  /** 最も変動費が多かった月の金額 */
  readonly amount: number;
  /** 最も変動費が多かった月の表示ラベル */
  readonly label: string;
};

/** 月別サマリーが空の場合に表示する最多変動費月。 */
const emptyHighestExpenseMonth: HighestExpenseMonth = {
  amount: 0,
  label: "-",
};

/**
 * @description 月別表示値から最も変動費が多かった月を抽出する。
 * @param summaries - 最多変動費月算出に使う月別表示値一覧。
 * @returns 最も変動費が多かった月の表示値。
 * @example
 * findHighestExpenseMonth(monthlySummaries);
 */
export function findHighestExpenseMonth(
  summaries: readonly AnnualMonthlySummary[],
): HighestExpenseMonth {
  /** 最初の月別サマリー */
  const firstSummary = summaries[0];

  if (firstSummary === undefined) {
    return emptyHighestExpenseMonth;
  }

  /** 変動費が最も多い月別サマリー */
  const highestExpenseSummary = summaries.reduce<AnnualMonthlySummary>(
    (highest, summary) => (summary.expense > highest.expense ? summary : highest),
    firstSummary,
  );

  return {
    amount: highestExpenseSummary.expense,
    label: highestExpenseSummary.month,
  };
}
