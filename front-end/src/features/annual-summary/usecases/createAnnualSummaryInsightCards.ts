import type {
  AnnualMonthlySummary,
  AnnualSummaryHighlight,
  AnnualSummaryTotals,
} from "@/features/annual-summary/domain/annualSummary";

import { findHighestExpenseMonth } from "@/features/annual-summary/usecases/findHighestExpenseMonth";
import { formatYen } from "@/libs/money";

/** 割合計算で使う100%。 */
const TOTAL_PERCENTAGE = 100;

/** 月別サマリーが空の場合に表示する前月比。 */
const emptyMonthComparison: AnnualSummaryHighlight = {
  id: "month-comparison",
  label: "データがありません",
  title: "前月 / 前年との比較",
  value: "--",
};

/**
 * 割合計算に必要な金額。
 */
type RateInput = {
  /** 割合の分母にする金額 */
  readonly denominator: number;
  /** 割合の分子にする金額 */
  readonly numerator: number;
};

/**
 * @description 分子と分母から整数パーセントを計算する。
 * @param input - 割合の分子と分母。
 * @returns 整数へ丸めたパーセント。
 * @example
 * calculateRate({ numerator: 25, denominator: 100 });
 */
const calculateRate = (input: RateInput): number =>
  input.denominator === 0
    ? 0
    : Math.round((input.numerator / input.denominator) * TOTAL_PERCENTAGE);

/**
 * @description 数値をパーセント表示へ変換する。
 * @param rate - 表示する割合。
 * @returns パーセント表示文字列。
 * @example
 * formatPercent(22);
 */
const formatPercent = (rate: number): string => `${rate}%`;

/**
 * @description 年間集計値から年間貯蓄率カードを作成する。
 * @param totals - 年間サマリー画面で利用する年間集計値。
 * @returns 年間貯蓄率カード。
 * @example
 * createSavingsRateCard(totals);
 */
const createSavingsRateCard = (
  totals: AnnualSummaryTotals,
): AnnualSummaryHighlight => ({
  id: "savings-rate",
  label: "年間実収支 ÷ 年間全収入",
  title: "年間貯蓄率",
  value: formatPercent(
    calculateRate({
      denominator: totals.totalIncome,
      numerator: totals.actualBalance,
    }),
  ),
});

/**
 * @description 年間集計値から固定費率カードを作成する。
 * @param totals - 年間サマリー画面で利用する年間集計値。
 * @returns 固定費率カード。
 * @example
 * createFixedCostRateCard(totals);
 */
const createFixedCostRateCard = (
  totals: AnnualSummaryTotals,
): AnnualSummaryHighlight => ({
  id: "fixed-cost-rate",
  label: "年間固定費 ÷ 年間全収入",
  title: "固定費率",
  value: formatPercent(
    calculateRate({
      denominator: totals.totalIncome,
      numerator: totals.fixedCost,
    }),
  ),
});

/**
 * @description 最も変動費が多い月カードを作成する。
 * @param summaries - 最多変動費月算出に使う月別表示値一覧。
 * @returns 最も変動費が多い月カード。
 * @example
 * createHighestExpenseMonthCard(monthlySummaries);
 */
const createHighestExpenseMonthCard = (
  summaries: readonly AnnualMonthlySummary[],
): AnnualSummaryHighlight => {
  /** 最も変動費が多い月 */
  const highestExpenseMonth = findHighestExpenseMonth(summaries);

  return {
    id: "highest-expense-month",
    label: undefined,
    title: "最も変動費が多かった月",
    value: `${highestExpenseMonth.label}: ${formatYen(highestExpenseMonth.amount)}`,
  };
};

/**
 * @description 月別表示値から前月比カードを作成する。
 * @param summaries - 前月比算出に使う月別表示値一覧。
 * @returns 前月比カード。
 * @example
 * createMonthComparisonCard(monthlySummaries);
 */
const createMonthComparisonCard = (
  summaries: readonly AnnualMonthlySummary[],
): AnnualSummaryHighlight => {
  /** 実収支がある最後の月のindex */
  const latestActiveMonthIndex = summaries.findLastIndex(
    (summary) =>
      summary.totalIncome !== 0 || summary.fixedCost !== 0 || summary.expense !== 0,
  );

  if (latestActiveMonthIndex <= 0) {
    return emptyMonthComparison;
  }

  /** 比較対象の月別サマリー */
  const currentMonth = summaries[latestActiveMonthIndex];
  /** 1か月前の月別サマリー */
  const previousMonth = summaries[latestActiveMonthIndex - 1];

  if (currentMonth === undefined || previousMonth === undefined) {
    return emptyMonthComparison;
  }

  /** 前月からの年間実収支差分 */
  const amountDifference = currentMonth.actualBalance - previousMonth.actualBalance;
  /** 前月比の符号付き金額表示 */
  const formattedDifference =
    amountDifference > 0
      ? `+${formatYen(amountDifference)}`
      : formatYen(amountDifference);

  return {
    id: "month-comparison",
    label: `${previousMonth.month}→${currentMonth.month}`,
    title: "前月比",
    value: formattedDifference,
  };
};

/**
 * @description 年間サマリー右カラムに表示する補助指標一覧を作成する。
 * @param summaries - 補助指標算出に使う月別表示値一覧。
 * @param totals - 年間サマリー画面で利用する年間集計値。
 * @returns 年間サマリー右カラムに表示する補助指標一覧。
 * @example
 * createAnnualSummaryInsightCards(monthlySummaries, totals);
 */
export const createAnnualSummaryInsightCards = (
  summaries: readonly AnnualMonthlySummary[],
  totals: AnnualSummaryTotals,
): readonly AnnualSummaryHighlight[] => [
  createSavingsRateCard(totals),
  createFixedCostRateCard(totals),
  createHighestExpenseMonthCard(summaries),
  createMonthComparisonCard(summaries),
];
