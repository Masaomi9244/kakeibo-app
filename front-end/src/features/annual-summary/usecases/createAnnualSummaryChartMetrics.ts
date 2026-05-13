import type {
  AnnualSummary,
  AnnualSummaryMonth,
  BarMetric,
  PieMetric,
} from "@/features/annual-summary/domain/annualSummary";

/** グラフ棒の最大高さ。 */
const MAX_BAR_HEIGHT = 180;

/** グラフ棒の最小高さ。 */
const MIN_BAR_HEIGHT = 6;

/** 残り予算を表す色。 */
const REMAINING_BALANCE_COLOR = "#059669";

/** 固定費を表す色。 */
const FIXED_COST_COLOR = "#f59e0b";

/** 出費を表す色。 */
const EXPENSE_COLOR = "#dc2626";

/** 割合計算の基準値。 */
const TOTAL_PERCENTAGE = 100;

/**
 * グラフ指標の高さ計算に必要な値。
 */
type BarHeightInput = {
  /** 最大値として扱う金額 */
  readonly maxValue: number;
  /** 高さへ変換する金額 */
  readonly value: number;
};

/**
 * @description 金額を棒グラフの高さへ変換する。
 * @param input - 最大値と変換対象の金額。
 * @returns 棒グラフに渡す高さ。
 * @example
 * calculateBarHeight({ value: 100, maxValue: 200 });
 */
const calculateBarHeight = (input: BarHeightInput): number => {
  if (input.value === 0 || input.maxValue === 0) {
    return 0;
  }

  return Math.max(
    MIN_BAR_HEIGHT,
    Math.round((Math.abs(input.value) / input.maxValue) * MAX_BAR_HEIGHT),
  );
};

/**
 * @description 月別サマリーの月表示ラベルを作成する。
 * @param month - APIから取得した月別サマリー。
 * @returns 月表示ラベル。
 * @example
 * createMonthMetricLabel({ month: "2026-05", totalIncome: 0, availableIncome: 0, reservedIncome: 0, fixedCostTotal: 0, expenseTotal: 0, actualBalance: 0, availableBalance: 0 });
 */
const createMonthMetricLabel = (month: AnnualSummaryMonth): string =>
  `${Number(month.month.slice(5, 7))}月`;

/**
 * @description 年間サマリーから月別出費推移グラフの指標を作成する。
 * @param annualSummary - APIから取得した年間サマリー。
 * @returns 月別出費推移グラフの指標一覧。
 * @example
 * createMonthlyExpenseTrendMetrics(annualSummary);
 */
export const createMonthlyExpenseTrendMetrics = (
  annualSummary: AnnualSummary,
): BarMetric[] => {
  /** 月別出費の最大金額 */
  const maxExpense = Math.max(
    ...annualSummary.months.map((month) => month.expenseTotal),
    0,
  );

  return annualSummary.months.map((month) => ({
    color: EXPENSE_COLOR,
    height: calculateBarHeight({
      maxValue: maxExpense,
      value: month.expenseTotal,
    }),
    id: month.month,
    label: createMonthMetricLabel(month),
    value: month.expenseTotal,
  }));
};

/**
 * @description 年間サマリーから年間収支内訳円グラフの指標を作成する。
 * @param annualSummary - APIから取得した年間サマリー。
 * @returns 年間収支内訳円グラフの指標一覧。
 * @example
 * createAnnualBreakdownMetrics(annualSummary);
 */
export const createAnnualBreakdownMetrics = (
  annualSummary: AnnualSummary,
): PieMetric[] => {
  /** 年間収支内訳円グラフに表示する残り予算 */
  const remainingBalance = Math.max(annualSummary.availableBalance, 0);
  /** 年間収支内訳円グラフの元データ */
  const metrics = [
    {
      color: FIXED_COST_COLOR,
      id: "fixed-cost",
      label: "固定費",
      value: annualSummary.fixedCostTotal,
    },
    {
      color: EXPENSE_COLOR,
      id: "expense",
      label: "出費",
      value: annualSummary.expenseTotal,
    },
    {
      color: REMAINING_BALANCE_COLOR,
      id: "remaining-balance",
      label: "残り予算",
      value: remainingBalance,
    },
  ];
  /** 年間収支内訳円グラフの合計金額 */
  const totalValue = metrics.reduce(
    (sum, metric) => sum + Math.max(metric.value, 0),
    0,
  );

  return metrics.map((metric) => ({
    ...metric,
    percentage:
      totalValue === 0
        ? 0
        : Math.round((Math.max(metric.value, 0) / totalValue) * TOTAL_PERCENTAGE),
  }));
};
