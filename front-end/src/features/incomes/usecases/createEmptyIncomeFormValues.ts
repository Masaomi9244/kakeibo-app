import type { IncomeFormValues } from "@/features/incomes/domain/incomeForm";

/**
 * @description 空の収入フォーム入力値を作成する。
 * @param incomeDate - 初期表示する入金日。
 * @returns 収入フォームの初期値。
 * @example
 * createEmptyIncomeFormValues("2026-05-25");
 */
export const createEmptyIncomeFormValues = (incomeDate: string): IncomeFormValues => ({
  amount: "",
  includedInBalance: true,
  incomeDate,
  memo: "",
});
