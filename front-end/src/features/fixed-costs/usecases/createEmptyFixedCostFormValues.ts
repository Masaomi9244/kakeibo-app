import type { FixedCostFormValues } from "@/features/fixed-costs/domain/fixedCost";

/**
 * @description 空の固定費フォーム入力値を作成する。
 * @param startMonth - 初期表示する開始月。
 * @returns 固定費フォームの初期値。
 * @example
 * createEmptyFixedCostFormValues("2026-05");
 */
export const createEmptyFixedCostFormValues = (
  startMonth: string,
): FixedCostFormValues => ({
  amount: "",
  name: "",
  startMonth,
});
