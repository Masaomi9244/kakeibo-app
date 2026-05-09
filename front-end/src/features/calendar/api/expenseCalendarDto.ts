import type { ExpenseDto } from "@/features/home/api/expenseDto";

/**
 * カレンダーAPIが返す1日分の集計DTO。
 */
export type ExpenseCalendarDayDto = {
  /** YYYY-MM-DD形式の日付 */
  readonly date: string;
  /** その日の出費合計 */
  readonly expenseTotal: number;
  /** その日終了時点の生活費残り */
  readonly remainingAmount: number;
};

/**
 * カレンダーAPIが返す月間集計DTO。
 */
export type ExpenseCalendarDto = {
  /** 対象月の使える収入合計 */
  readonly availableIncome: number;
  /** カレンダーに表示する日別集計 */
  readonly days: ExpenseCalendarDayDto[];
  /** 対象月の出費合計 */
  readonly expenseTotal: number;
  /** 対象月の固定費合計 */
  readonly fixedCostTotal: number;
  /** YYYY-MM形式の対象月 */
  readonly month: string;
  /** 対象月の生活費残り */
  readonly remainingAmount: number;
  /** 選択日の出費明細 */
  readonly selectedDateExpenses: ExpenseDto[];
};

/**
 * カレンダー取得API response DTO。
 */
export type GetExpenseCalendarResponse = {
  /** 月間カレンダー集計 */
  readonly expenseCalendar: ExpenseCalendarDto;
};
