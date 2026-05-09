import type { FixedCostItem } from "@/features/fixed-costs/domain/fixedCost";

/** 固定費画面モックに表示する固定費一覧。 */
const fixedCostItems: readonly FixedCostItem[] = [
  {
    amount: 80_000,
    id: "fixed-rent",
    isActive: true,
    name: "家賃",
    startMonth: "2026-05",
  },
  {
    amount: 12_000,
    id: "fixed-utility",
    isActive: true,
    name: "光熱費",
    startMonth: "2026-05",
  },
  {
    amount: 3_200,
    id: "fixed-phone",
    isActive: true,
    name: "スマホ代",
    startMonth: "2026-05",
  },
];

/**
 * @description 固定費画面モックで利用する固定費一覧を返す。
 * @param なし
 * @returns 固定費一覧。
 * @example
 * getFixedCostMockData();
 */
export const getFixedCostMockData = (): readonly FixedCostItem[] => fixedCostItems;
