import type {
  AnnualMonthlySummary,
  AnnualSummaryHighlight,
} from "@/features/annual-summary/domain/annualSummary";

import { findHighestExpenseMonth } from "@/features/annual-summary/usecases/findHighestExpenseMonth";

/** 月別サマリーが空の場合に表示する最多収入月。 */
const emptyHighestIncomeMonth: AnnualSummaryHighlight = {
  amount: 0,
  label: "-",
  title: "最も収入が多かった月",
};

/** 月別サマリーが空の場合に表示する月平均収入。 */
const emptyAverageMonthlyIncome: AnnualSummaryHighlight = {
  amount: 0,
  label: "月平均",
  title: "月ごとの平均収入額",
};

/** 月別サマリーが空の場合に表示する固定費増加額。 */
const emptyFixedCostIncrease: AnnualSummaryHighlight = {
  amount: 0,
  label: "-",
  title: "今年の固定費増加額",
};

/**
 * @description 月別表示値から最も収入が多かった月を抽出する。
 * @param summaries - 最多収入月算出に使う月別表示値一覧。
 * @returns 最も収入が多かった月の表示値。
 * @example
 * findHighestIncomeMonth(monthlySummaries);
 */
const findHighestIncomeMonth = (
  summaries: readonly AnnualMonthlySummary[],
): AnnualSummaryHighlight => {
  /** 最初の月別サマリー */
  const firstSummary = summaries[0];

  if (firstSummary === undefined) {
    return emptyHighestIncomeMonth;
  }

  /** 収入が最も多い月別サマリー */
  const highestIncomeSummary = summaries.reduce<AnnualMonthlySummary>(
    (highest, summary) =>
      summary.totalIncome > highest.totalIncome ? summary : highest,
    firstSummary,
  );

  return {
    amount: highestIncomeSummary.totalIncome,
    label: highestIncomeSummary.month,
    title: "最も収入が多かった月",
  };
};

/**
 * @description 月別表示値から月ごとの平均収入額を計算する。
 * @param summaries - 平均収入額算出に使う月別表示値一覧。
 * @returns 月ごとの平均収入額の表示値。
 * @example
 * calculateAverageMonthlyIncome(monthlySummaries);
 */
const calculateAverageMonthlyIncome = (
  summaries: readonly AnnualMonthlySummary[],
): AnnualSummaryHighlight => {
  if (summaries.length === 0) {
    return emptyAverageMonthlyIncome;
  }

  /** 年間全収入の合計 */
  const totalIncome = summaries.reduce(
    (total, summary) => total + summary.totalIncome,
    0,
  );

  return {
    amount: Math.round(totalIncome / summaries.length),
    label: "月平均",
    title: "月ごとの平均収入額",
  };
};

/**
 * @description 月別表示値から今年の固定費増加額を計算する。
 * @param summaries - 固定費増加額算出に使う月別表示値一覧。
 * @returns 今年の固定費増加額の表示値。
 * @example
 * calculateFixedCostIncrease(monthlySummaries);
 */
const calculateFixedCostIncrease = (
  summaries: readonly AnnualMonthlySummary[],
): AnnualSummaryHighlight => {
  /** 最初の月別サマリー */
  const firstSummary = summaries[0];
  /** 最後の月別サマリー */
  const lastSummary = summaries.at(-1);

  if (firstSummary === undefined || lastSummary === undefined) {
    return emptyFixedCostIncrease;
  }

  return {
    amount: lastSummary.fixedCost - firstSummary.fixedCost,
    label: `${firstSummary.month}→${lastSummary.month}`,
    title: "今年の固定費増加額",
  };
};

/**
 * @description 年間サマリー右カラムに表示する補助指標一覧を作成する。
 * @param summaries - 補助指標算出に使う月別表示値一覧。
 * @returns 年間サマリー右カラムに表示する補助指標一覧。
 * @example
 * createAnnualSummaryInsightCards(monthlySummaries);
 */
export const createAnnualSummaryInsightCards = (
  summaries: readonly AnnualMonthlySummary[],
): readonly AnnualSummaryHighlight[] => [
  findHighestExpenseMonth(summaries),
  findHighestIncomeMonth(summaries),
  calculateAverageMonthlyIncome(summaries),
  calculateFixedCostIncrease(summaries),
];
