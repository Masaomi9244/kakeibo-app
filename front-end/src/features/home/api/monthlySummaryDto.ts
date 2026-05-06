/**
 * 月次サマリーAPIが返す月次サマリーDTO。
 */
export type MonthlySummaryDto = {
  readonly actualBalance: number;
  readonly availableIncome: number;
  readonly expenseTotal: number;
  readonly fixedCostTotal: number;
  readonly month: string;
  readonly remainingAmount: number;
  readonly reservedIncome: number;
  readonly totalIncome: number;
};

/**
 * 月次サマリー取得API response DTO。
 */
export type GetMonthlySummaryResponse = {
  readonly monthlySummary: MonthlySummaryDto;
};
