import type {
  AnnualMonthlySummary,
  AnnualSummaryMockData,
  BarMetric,
} from "@/features/annual-summary/domain/annualSummary";

/** 年間サマリーに表示する月別集計一覧。 */
const monthlySummaries: readonly AnnualMonthlySummary[] = [
  {
    availableIncome: 0,
    expense: 0,
    fixedCost: 0,
    month: "1月",
    remainingBalance: 0,
    reservedIncome: 0,
    totalIncome: 0,
  },
  {
    availableIncome: 0,
    expense: 0,
    fixedCost: 0,
    month: "2月",
    remainingBalance: 0,
    reservedIncome: 0,
    totalIncome: 0,
  },
  {
    availableIncome: 0,
    expense: 0,
    fixedCost: 0,
    month: "3月",
    remainingBalance: 0,
    reservedIncome: 0,
    totalIncome: 0,
  },
  {
    availableIncome: 0,
    expense: 0,
    fixedCost: 0,
    month: "4月",
    remainingBalance: 0,
    reservedIncome: 0,
    totalIncome: 0,
  },
  {
    availableIncome: 315_000,
    expense: 5_960,
    fixedCost: 95_200,
    month: "5月",
    remainingBalance: 213_840,
    reservedIncome: 0,
    totalIncome: 315_000,
  },
  {
    availableIncome: 0,
    expense: 0,
    fixedCost: 95_200,
    month: "6月",
    remainingBalance: 0,
    reservedIncome: 0,
    totalIncome: 0,
  },
  {
    availableIncome: 0,
    expense: 0,
    fixedCost: 95_200,
    month: "7月",
    remainingBalance: 0,
    reservedIncome: 0,
    totalIncome: 0,
  },
  {
    availableIncome: 0,
    expense: 0,
    fixedCost: 95_200,
    month: "8月",
    remainingBalance: 0,
    reservedIncome: 0,
    totalIncome: 0,
  },
  {
    availableIncome: 0,
    expense: 0,
    fixedCost: 95_200,
    month: "9月",
    remainingBalance: 0,
    reservedIncome: 0,
    totalIncome: 0,
  },
  {
    availableIncome: 0,
    expense: 0,
    fixedCost: 95_200,
    month: "10月",
    remainingBalance: 0,
    reservedIncome: 0,
    totalIncome: 0,
  },
  {
    availableIncome: 0,
    expense: 0,
    fixedCost: 95_200,
    month: "11月",
    remainingBalance: 0,
    reservedIncome: 0,
    totalIncome: 0,
  },
  {
    availableIncome: 0,
    expense: 0,
    fixedCost: 95_200,
    month: "12月",
    remainingBalance: 0,
    reservedIncome: 0,
    totalIncome: 0,
  },
];

/** 年間サマリーの収支内訳グラフに表示する指標一覧。 */
const chartMetrics: readonly BarMetric[] = [
  { color: "#059669", id: "available-income", label: "使える収入", value: 315_000 },
  { color: "#f59e0b", id: "fixed-cost", label: "固定費", value: 95_200 },
  { color: "#dc2626", id: "expense", label: "出費", value: 5_960 },
  { color: "#0d9488", id: "remaining", label: "生活費残り", value: 213_840 },
];

/**
 * @description 年間サマリー画面モックで利用する集計データを返す。
 * @param なし
 * @returns 年間サマリー画面モックデータ。
 * @example
 * getAnnualSummaryMockData();
 */
export const getAnnualSummaryMockData = (): AnnualSummaryMockData => ({
  chartMetrics,
  monthlySummaries,
});
