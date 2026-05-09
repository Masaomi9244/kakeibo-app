import type { Income } from "@/domains/income";
import type { IncomeFormValues } from "@/features/incomes/domain/incomeForm";

/**
 * @description 収入domain modelを編集フォーム入力値へ変換する。
 * @param income - 編集対象の収入。
 * @returns 収入フォーム入力値。
 * @example
 * mapIncomeToFormValues(income);
 */
export const mapIncomeToFormValues = (income: Income): IncomeFormValues => ({
  amount: String(income.amount),
  includedInBalance: income.includedInBalance,
  incomeDate: income.incomeDate,
  memo: income.memo ?? "",
});
