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
 * 年間サマリーの統計カードで使う金額の意味色。
 */
export type AnnualSummaryStatTone = "default" | "expense" | "fixedCost" | "income";

/**
 * 年間サマリー画面の統計カードに表示する値。
 */
export type AnnualSummaryStatCard = {
  /** 統計カードで強調する金額 */
  readonly amount: number;
  /** 統計カードを識別するID */
  readonly id: string;
  /** 金額の上に表示するラベル */
  readonly label: string;
  /** 金額が表す意味色 */
  readonly tone: AnnualSummaryStatTone;
};

/**
 * 年間サマリー画面で利用する年間集計値。
 */
export type AnnualSummaryTotals = {
  /** 年間使える収入 */
  readonly availableIncome: number;
  /** 年間出費 */
  readonly expense: number;
  /** 年間固定費 */
  readonly fixedCost: number;
  /** 年間生活費残り */
  readonly remainingBalance: number;
  /** 年間貯める収入 */
  readonly reservedIncome: number;
  /** 年間全収入 */
  readonly totalIncome: number;
  /** 年間実収支 */
  readonly actualBalance: number;
};

/**
 * 年間サマリー画面の注目月に表示する値。
 */
export type AnnualSummaryHighlight = {
  /** 注目月の金額 */
  readonly amount: number;
  /** 注目月の表示ラベル */
  readonly label: string;
  /** 注目月の補足タイトル */
  readonly title: string;
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
