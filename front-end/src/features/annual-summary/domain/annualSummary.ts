/**
 * 年間サマリーの月別一覧に表示する1か月分の集計。
 */
export type AnnualMonthlySummary = {
  /** 使える収入 */
  readonly availableIncome: number;
  /** 出費 */
  readonly expense: number;
  /** 固定費 */
  readonly fixedCost: number;
  /** 表示月 */
  readonly month: string;
  /** 生活費残り */
  readonly remainingBalance: number;
  /** 貯める収入 */
  readonly reservedIncome: number;
  /** 全収入 */
  readonly totalIncome: number;
};

/**
 * 年間サマリーの棒グラフに表示する指標。
 */
export type BarMetric = {
  /** 棒の色 */
  readonly color: string;
  /** 指標ID */
  readonly id: string;
  /** 指標ラベル */
  readonly label: string;
  /** 指標金額 */
  readonly value: number;
};

/**
 * 年間サマリー画面モックで利用するデータ。
 */
export type AnnualSummaryMockData = {
  /** 収支内訳グラフの指標一覧 */
  readonly chartMetrics: readonly BarMetric[];
  /** 月別サマリー一覧 */
  readonly monthlySummaries: readonly AnnualMonthlySummary[];
};
