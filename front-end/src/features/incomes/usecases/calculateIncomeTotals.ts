import type { Income } from "@/domains/income";

/**
 * 収入一覧から算出する合計値。
 */
export type IncomeTotals = {
  /** 予算に含める収入合計 */
  readonly includedIncome: number;
  /** 全収入合計 */
  readonly totalIncome: number;
};

/**
 * @description 収入一覧から全収入と予算に含める収入の合計を算出する。
 * @param incomes - 対象月の収入一覧。
 * @returns 収入サマリーに表示する合計値。
 * @example
 * calculateIncomeTotals(incomes);
 */
export const calculateIncomeTotals = (incomes: readonly Income[]): IncomeTotals => ({
  includedIncome: incomes.reduce(
    (total, income) => total + (income.includedInBalance ? income.amount : 0),
    0,
  ),
  totalIncome: incomes.reduce((total, income) => total + income.amount, 0),
});
