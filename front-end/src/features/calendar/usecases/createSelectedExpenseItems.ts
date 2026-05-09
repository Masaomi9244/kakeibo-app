import type { Expense } from "@/domains/expense";
import type { SelectedExpense } from "@/features/calendar/domain/calendar";

import { formatAsiaTokyoTime } from "@/libs/date";

/**
 * @description APIから取得した出費domain modelを選択日一覧の表示項目へ変換する。
 * @param expenses - 選択日の出費domain model一覧。
 * @returns 選択日の出費一覧に表示する項目。
 * @example
 * createSelectedExpenseItems([{ id: "id", amount: 780, spentAt: "2026-05-06T09:15:00+09:00" }]);
 */
export const createSelectedExpenseItems = (
  expenses: readonly Expense[],
): SelectedExpense[] =>
  expenses.map((expense) => ({
    amount: expense.amount,
    id: expense.id,
    time: formatAsiaTokyoTime(expense.spentAt),
  }));
