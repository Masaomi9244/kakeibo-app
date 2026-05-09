import type {
  CalendarMonthStats,
  ExpenseCalendar,
} from "@/features/calendar/domain/calendar";

import { calculateDailySpendingGuide } from "@/features/home/usecases/calculateDailySpendingGuide";

/**
 * 月次カレンダー集計に必要な入力値。
 */
export type CalendarMonthStatsInput = {
  /** APIから取得した月間カレンダー集計 */
  readonly expenseCalendar: ExpenseCalendar;
  /** YYYY-MM-DD形式の集計基準日 */
  readonly targetDate: string;
};

/**
 * @description 対象月の日別集計から平均支出の分母に使う日数を算出する。
 * @param input - APIから取得した月間カレンダー集計と集計基準日。
 * @returns 平均支出計算に使う日数。
 * @example
 * calculateAverageExpenseDayCount({ expenseCalendar, targetDate: "2026-05-06" });
 */
const calculateAverageExpenseDayCount = (input: CalendarMonthStatsInput): number => {
  if (!input.targetDate.startsWith(`${input.expenseCalendar.month}-`)) {
    return Math.max(input.expenseCalendar.days.length, 1);
  }

  /** 集計基準日の日 */
  const targetDay = Number(input.targetDate.slice(8, 10));

  return Math.max(targetDay, 1);
};

/**
 * @description APIから取得した月間カレンダー集計から画面下部の月次集計を算出する。
 * @param input - APIから取得した月間カレンダー集計と集計基準日。
 * @returns 月間カレンダー下部に表示する月次集計。
 * @example
 * calculateCalendarMonthStats({ expenseCalendar, targetDate: "2026-05-06" });
 */
export const calculateCalendarMonthStats = (
  input: CalendarMonthStatsInput,
): CalendarMonthStats => {
  /** 平均支出計算に使う日数 */
  const averageExpenseDayCount = calculateAverageExpenseDayCount(input);

  return {
    averageExpensePerDay: Math.floor(
      input.expenseCalendar.expenseTotal / averageExpenseDayCount,
    ),
    dailySpendingGuide: calculateDailySpendingGuide({
      date: input.targetDate,
      month: input.expenseCalendar.month,
      remainingAmount: input.expenseCalendar.remainingAmount,
    }),
    monthlyExpenseTotal: input.expenseCalendar.expenseTotal,
  };
};
