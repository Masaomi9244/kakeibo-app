import type { Expense } from "@/domains/expense";

/**
 * 月間カレンダーの1日分セルに表示する値。
 */
export type CalendarCell = {
  /** YYYY-MM-DD形式の日付キー */
  readonly dateKey: string;
  /** カレンダーに表示する日 */
  readonly day: number;
  /** その日の出費合計 */
  readonly expenseTotal?: number;
  /** 表示対象月の日付か */
  readonly isCurrentMonth: boolean;
  /** 選択中の日付か */
  readonly isSelected: boolean;
};

/**
 * APIから取得した対象月の1日分集計。
 */
export type ExpenseCalendarDay = {
  /** YYYY-MM-DD形式の日付 */
  readonly date: string;
  /** その日の出費合計 */
  readonly expenseTotal: number;
  /** その日終了時点の生活費残り */
  readonly remainingAmount: number;
};

/**
 * APIから取得した月間カレンダー集計。
 */
export type ExpenseCalendar = {
  /** 対象月の使える収入合計 */
  readonly availableIncome: number;
  /** カレンダーに表示する日別集計 */
  readonly days: readonly ExpenseCalendarDay[];
  /** 対象月の出費合計 */
  readonly expenseTotal: number;
  /** 対象月の固定費合計 */
  readonly fixedCostTotal: number;
  /** YYYY-MM形式の対象月 */
  readonly month: string;
  /** 対象月の生活費残り */
  readonly remainingAmount: number;
  /** 選択日の出費明細 */
  readonly selectedDateExpenses: readonly Expense[];
};

/**
 * 選択日の支出一覧に表示する出費。
 */
export type SelectedExpense = {
  /** 出費金額 */
  readonly amount: number;
  /** 出費ID */
  readonly id: string;
  /** HH:mm形式の出費時刻 */
  readonly time: string;
};

/**
 * 月間カレンダー下部に表示する月次集計。
 */
export type CalendarMonthStats = {
  /** 1日の目安 */
  readonly dailySpendingGuide: number;
  /** 平均支出/日 */
  readonly averageExpensePerDay: number;
  /** 今月の支出 */
  readonly monthlyExpenseTotal: number;
};
