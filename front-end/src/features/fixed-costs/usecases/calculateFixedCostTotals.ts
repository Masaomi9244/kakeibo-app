import type { FixedCostItem } from "@/features/fixed-costs/domain/fixedCost";

/**
 * 固定費一覧から算出する合計値。
 */
export type FixedCostTotals = {
  /** 有効な固定費合計 */
  readonly activeFixedCostTotal: number;
  /** 固定費一覧の件数表示 */
  readonly fixedCostCountLabel: string;
  /** 固定費一覧の全件合計 */
  readonly fixedCostTotal: number;
};

/**
 * @description 固定費一覧から有効分合計、全件合計、件数表示を算出する。
 * @param fixedCosts - 固定費一覧。
 * @returns 固定費サマリーに表示する合計値。
 * @example
 * calculateFixedCostTotals(fixedCosts);
 */
export const calculateFixedCostTotals = (
  fixedCosts: readonly FixedCostItem[],
): FixedCostTotals => ({
  activeFixedCostTotal: fixedCosts.reduce(
    (total, fixedCost) => total + (fixedCost.isActive ? fixedCost.amount : 0),
    0,
  ),
  fixedCostCountLabel: `${fixedCosts.length}件の固定費`,
  fixedCostTotal: fixedCosts.reduce((total, fixedCost) => total + fixedCost.amount, 0),
});
