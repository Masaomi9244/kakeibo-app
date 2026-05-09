import type {
  CalendarCell,
  CalendarMonthStats,
} from "@/features/calendar/domain/calendar";

/**
 * 月次カレンダー集計に必要な入力値。
 */
export type CalendarMonthStatsInput = {
  /** 1日の目安 */
  readonly dailySpendingGuide: number;
  /** カレンダーセル一覧 */
  readonly calendarCells: readonly CalendarCell[];
};

/**
 * @description カレンダーセル一覧から月次支出合計と平均支出を算出する。
 * @param input - カレンダーセル一覧と1日の目安。
 * @returns 月間カレンダー下部に表示する月次集計。
 * @example
 * calculateCalendarMonthStats({ calendarCells, dailySpendingGuide: 7090 });
 */
export const calculateCalendarMonthStats = (
  input: CalendarMonthStatsInput,
): CalendarMonthStats => {
  /** 表示対象月の日付セル一覧 */
  const currentMonthCells = input.calendarCells.filter((cell) => cell.isCurrentMonth);
  /** 表示対象月の出費がある日付セル一覧 */
  const spentCells = currentMonthCells.filter(
    (cell) => cell.expenseTotal !== undefined,
  );
  /** 表示対象月の支出合計 */
  const monthlyExpenseTotal = currentMonthCells.reduce(
    (total, cell) => total + (cell.expenseTotal ?? 0),
    0,
  );

  return {
    averageExpensePerDay:
      spentCells.length === 0 ? 0 : Math.floor(monthlyExpenseTotal / spentCells.length),
    dailySpendingGuide: input.dailySpendingGuide,
    monthlyExpenseTotal,
  };
};
