import type {
  AnnualMonthlySummary,
  AnnualSummaryHighlight,
} from "@/features/annual-summary/domain/annualSummary";

/** 月別サマリーが空の場合に表示する最多支出月。 */
const emptyHighestExpenseMonth: AnnualSummaryHighlight = {
  amount: 0,
  label: "-",
  title: "最も支出が多かった月",
};

/**
 * @description 月別表示値から最も支出が多かった月を抽出する。
 * @param summaries - 最多支出月算出に使う月別表示値一覧。
 * @returns 最も支出が多かった月の表示値。
 * @example
 * findHighestExpenseMonth(monthlySummaries);
 */
export function findHighestExpenseMonth(
  summaries: readonly AnnualMonthlySummary[],
): AnnualSummaryHighlight {
  /** 最初の月別サマリー */
  const firstSummary = summaries[0];

  if (firstSummary === undefined) {
    return emptyHighestExpenseMonth;
  }

  /** 支出が最も多い月別サマリー */
  const highestExpenseSummary = summaries.reduce<AnnualMonthlySummary>(
    (highest, summary) => (summary.expense > highest.expense ? summary : highest),
    firstSummary,
  );

  return {
    amount: highestExpenseSummary.expense,
    label: highestExpenseSummary.month,
    title: "最も支出が多かった月",
  };
}
