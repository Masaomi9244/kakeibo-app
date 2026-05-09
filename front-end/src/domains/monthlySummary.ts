/**
 * 月次サマリーdomain model。
 */
export type MonthlySummary = {
  /** 実収支 */
  readonly actualBalance: number;
  /** 使える収入 */
  readonly availableIncome: number;
  /** 出費合計 */
  readonly expenseTotal: number;
  /** 固定費合計 */
  readonly fixedCostTotal: number;
  /** YYYY-MM形式の対象月 */
  readonly month: string;
  /** 今月の残り予算 */
  readonly remainingAmount: number;
  /** 貯める収入 */
  readonly reservedIncome: number;
  /** 全収入 */
  readonly totalIncome: number;
};
