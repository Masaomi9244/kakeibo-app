/**
 * フロントエンドで扱う月次サマリーdomain model。
 */
export type MonthlySummary = {
  readonly actualBalance: number;
  readonly availableIncome: number;
  readonly expenseTotal: number;
  readonly fixedCostTotal: number;
  readonly month: string;
  readonly remainingAmount: number;
  readonly reservedIncome: number;
  readonly totalIncome: number;
};
