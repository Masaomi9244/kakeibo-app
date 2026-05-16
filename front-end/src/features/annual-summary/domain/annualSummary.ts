/**
 * APIから取得した対象年の1か月分集計。
 */
export type AnnualSummaryMonth = {
  /** 月別の実収支 */
  readonly actualBalance: number;
  /** 月別の使える収入 */
  readonly availableIncome: number;
  /** 月別の生活費残り */
  readonly availableBalance: number;
  /** 月別の出費 */
  readonly expenseTotal: number;
  /** 月別の固定費 */
  readonly fixedCostTotal: number;
  /** YYYY-MM形式の対象月 */
  readonly month: string;
  /** 月別の貯める収入 */
  readonly reservedIncome: number;
  /** 月別の全収入 */
  readonly totalIncome: number;
};

/**
 * APIから取得した対象年の年間集計。
 */
export type AnnualSummary = {
  /** 年間実収支 */
  readonly actualBalance: number;
  /** 年間使える収入 */
  readonly availableIncome: number;
  /** 年間生活費残り */
  readonly availableBalance: number;
  /** 年間変動費 */
  readonly expenseTotal: number;
  /** 年間固定費 */
  readonly fixedCostTotal: number;
  /** APIから取得した月別集計一覧 */
  readonly months: readonly AnnualSummaryMonth[];
  /** 年間貯める収入 */
  readonly reservedIncome: number;
  /** 年間全収入 */
  readonly totalIncome: number;
  /** 対象年 */
  readonly year: number;
};

/**
 * 年間サマリーの補助表示に使う1か月分の集計。
 */
export type AnnualMonthlySummary = {
  /** 月別の実収支 */
  readonly actualBalance: number;
  /** 月別の使える収入 */
  readonly availableIncome: number;
  /** 月別の出費 */
  readonly expense: number;
  /** 月別の固定費 */
  readonly fixedCost: number;
  /** 表示月 */
  readonly month: string;
  /** 月別の生活費残り */
  readonly remainingBalance: number;
  /** 貯める収入 */
  readonly reservedIncome: number;
  /** 全収入 */
  readonly totalIncome: number;
};

/**
 * 年間サマリー画面で利用する年間集計値。
 */
export type AnnualSummaryTotals = {
  /** 年間使える収入 */
  readonly availableIncome: number;
  /** 年間変動費 */
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
 * 年間サマリーの統計カードで使う金額の意味色。
 */
export type AnnualSummaryStatTone = "default" | "expense" | "fixedCost" | "income";

/**
 * 年間サマリー画面の統計カードに表示する値。
 */
export type AnnualSummaryStatCard = {
  /** 統計カードで強調する金額 */
  readonly amount: number;
  /** 重要指標として背景を強調するか */
  readonly emphasized: boolean;
  /** 統計カードを識別するID */
  readonly id: string;
  /** 金額の上に表示するラベル */
  readonly label: string;
  /** 金額が表す意味色 */
  readonly tone: AnnualSummaryStatTone;
};

/**
 * 年間サマリー画面の注目月に表示する値。
 */
export type AnnualSummaryHighlight = {
  /** 補助指標カードを識別するID */
  readonly id: string;
  /** 補助指標の補足ラベル */
  readonly label: string | undefined;
  /** 補助指標のタイトル */
  readonly title: string;
  /** 補助指標の表示値 */
  readonly value: string;
};

/**
 * 年間サマリーの棒グラフに表示する指標。
 */
export type BarMetric = {
  /** 棒の色 */
  readonly color: string;
  /** 棒の高さ */
  readonly height: number;
  /** 指標ID */
  readonly id: string;
  /** 指標ラベル */
  readonly label: string;
  /** 指標金額 */
  readonly value: number;
};

/**
 * 年間サマリーの円グラフに表示する指標。
 */
export type PieMetric = {
  /** セグメントの色 */
  readonly color: string;
  /** 指標を識別するID */
  readonly id: string;
  /** 指標ラベル */
  readonly label: string;
  /** 円グラフ全体に占める割合 */
  readonly percentage: number;
  /** 指標金額 */
  readonly value: number;
};
