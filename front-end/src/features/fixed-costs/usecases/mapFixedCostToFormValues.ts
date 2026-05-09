import type {
  FixedCostFormValues,
  FixedCostItem,
} from "@/features/fixed-costs/domain/fixedCost";

/**
 * @description 固定費domain modelを編集フォーム入力値へ変換する。
 * @param fixedCost - 編集対象の固定費。
 * @returns 固定費フォーム入力値。
 * @example
 * mapFixedCostToFormValues(fixedCost);
 */
export const mapFixedCostToFormValues = (
  fixedCost: FixedCostItem,
): FixedCostFormValues => ({
  amount: String(fixedCost.amount),
  name: fixedCost.name,
  startMonth: fixedCost.startMonth.slice(0, 7),
});
