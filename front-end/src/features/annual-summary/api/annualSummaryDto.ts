/**
 * 年間サマリーAPIが返す1か月分の集計DTO。
 */
export type AnnualSummaryMonthDto = {
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
 * 年間サマリーAPIが返す年間集計DTO。
 */
export type AnnualSummaryDto = {
  /** 年間実収支 */
  readonly actualBalance: number;
  /** 年間使える収入 */
  readonly availableIncome: number;
  /** 年間生活費残り */
  readonly availableBalance: number;
  /** 年間出費 */
  readonly expenseTotal: number;
  /** 年間固定費 */
  readonly fixedCostTotal: number;
  /** 月別サマリー一覧 */
  readonly months: AnnualSummaryMonthDto[];
  /** 年間貯める収入 */
  readonly reservedIncome: number;
  /** 年間全収入 */
  readonly totalIncome: number;
  /** 対象年 */
  readonly year: number;
};

/**
 * 年間サマリー取得API response DTO。
 */
export type GetAnnualSummaryResponse = {
  /** 年間サマリー集計 */
  readonly annualSummary: AnnualSummaryDto;
};
