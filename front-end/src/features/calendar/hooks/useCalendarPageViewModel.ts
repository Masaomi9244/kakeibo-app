import { useMemo, useState } from "react";

import type {
  CalendarCell,
  CalendarMonthStats,
  SelectedExpense,
} from "@/features/calendar/domain/calendar";

import { useExpenseCalendar } from "@/features/calendar/hooks/useExpenseCalendar";
import { calculateCalendarMonthStats } from "@/features/calendar/usecases/calculateCalendarMonthStats";
import { createCalendarCells } from "@/features/calendar/usecases/createCalendarCells";
import { createSelectedExpenseItems } from "@/features/calendar/usecases/createSelectedExpenseItems";
import { formatCalendarDateLabel } from "@/features/calendar/usecases/formatCalendarDateLabel";
import { formatCalendarMonthLabel } from "@/features/calendar/usecases/formatCalendarMonthLabel";
import { getCalendarWeekDays } from "@/features/calendar/usecases/getCalendarWeekDays";
import { shiftCalendarMonth } from "@/features/calendar/usecases/shiftCalendarMonth";
import { formatAsiaTokyoDate, formatAsiaTokyoMonth } from "@/libs/date";

/**
 * カレンダー画面templateへ渡すview model。
 */
export type CalendarPageViewModel = {
  /** カレンダーセル一覧 */
  readonly calendarCells: readonly CalendarCell[];
  /** 月間カレンダー取得エラー文言 */
  readonly calendarErrorMessage: string | undefined;
  /** 月間カレンダー読み込み中か */
  readonly calendarIsLoading: boolean;
  /** 今月ボタン押下時に呼び出す処理 */
  readonly handleGoToCurrentMonth: () => void;
  /** 翌月ボタン押下時に呼び出す処理 */
  readonly handleGoToNextMonth: () => void;
  /** 前月ボタン押下時に呼び出す処理 */
  readonly handleGoToPreviousMonth: () => void;
  /** 日付セル選択時に呼び出す処理 */
  readonly handleSelectDate: (dateKey: string) => void;
  /** 月間カレンダーに表示する対象月 */
  readonly monthLabel: string;
  /** 選択日の表示ラベル */
  readonly selectedDateLabel: string;
  /** 選択日の出費一覧 */
  readonly selectedExpenses: readonly SelectedExpense[];
  /** 選択日の出費合計 */
  readonly selectedDayTotal: number;
  /** 月間カレンダー下部に表示する月次集計 */
  readonly stats: CalendarMonthStats;
  /** 曜日ラベル一覧 */
  readonly weekDays: readonly string[];
};

/**
 * @description 月間カレンダー画面の選択状態、表示集計、選択日出費をまとめる。
 * @param なし。
 * @returns 月間カレンダー画面templateへ渡すview model。
 * @example
 * const calendarPage = useCalendarPageViewModel();
 */
export function useCalendarPageViewModel(): CalendarPageViewModel {
  /** 今日の日付 */
  const todayDate = useMemo(() => formatAsiaTokyoDate(new Date()), []);
  /** 今月 */
  const todayMonth = useMemo(() => formatAsiaTokyoMonth(new Date()), []);
  /** 表示中の対象月 */
  const [currentMonth, setCurrentMonth] = useState(todayMonth);
  /** 選択中の日付キー */
  const [selectedDateKey, setSelectedDateKey] = useState(todayDate);
  /** 月間カレンダー取得query */
  const expenseCalendarQuery = useExpenseCalendar(currentMonth, selectedDateKey);
  /** APIから取得した月間カレンダー集計 */
  const expenseCalendar = expenseCalendarQuery.data;
  /** カレンダーセル一覧 */
  const calendarCells =
    expenseCalendar === undefined
      ? []
      : createCalendarCells(expenseCalendar, selectedDateKey);
  /** 選択日の出費一覧 */
  const selectedExpenses =
    expenseCalendar === undefined
      ? []
      : createSelectedExpenseItems(expenseCalendar.selectedDateExpenses);
  /** 選択日の出費合計 */
  const selectedDayTotal = selectedExpenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );
  /** 月間カレンダー下部に表示する月次集計 */
  const stats =
    expenseCalendar === undefined
      ? { averageExpensePerDay: 0, dailySpendingGuide: 0, monthlyExpenseTotal: 0 }
      : calculateCalendarMonthStats({
          expenseCalendar,
          targetDate: todayDate,
        });

  /**
   * @description カレンダーの日付選択状態を更新する。
   * @param dateKey - YYYY-MM-DD形式の日付キー。
   * @returns なし。
   * @example
   * handleSelectDate("2026-05-06");
   */
  const handleSelectDate = (dateKey: string): void => {
    setCurrentMonth(dateKey.slice(0, 7));
    setSelectedDateKey(dateKey);
  };

  /**
   * @description 表示対象月を前月へ移動する。
   * @param なし。
   * @returns なし。
   * @example
   * handleGoToPreviousMonth();
   */
  const handleGoToPreviousMonth = (): void => {
    /** 前月 */
    const previousMonth = shiftCalendarMonth(currentMonth, -1);

    setCurrentMonth(previousMonth);
    setSelectedDateKey(`${previousMonth}-01`);
  };

  /**
   * @description 表示対象月を今月へ戻す。
   * @param なし。
   * @returns なし。
   * @example
   * handleGoToCurrentMonth();
   */
  const handleGoToCurrentMonth = (): void => {
    setCurrentMonth(todayMonth);
    setSelectedDateKey(todayDate);
  };

  /**
   * @description 表示対象月を翌月へ移動する。
   * @param なし。
   * @returns なし。
   * @example
   * handleGoToNextMonth();
   */
  const handleGoToNextMonth = (): void => {
    /** 翌月 */
    const nextMonth = shiftCalendarMonth(currentMonth, 1);

    setCurrentMonth(nextMonth);
    setSelectedDateKey(`${nextMonth}-01`);
  };

  return {
    calendarCells,
    calendarErrorMessage: expenseCalendarQuery.isError
      ? expenseCalendarQuery.error.message
      : undefined,
    calendarIsLoading: expenseCalendarQuery.isLoading,
    handleGoToCurrentMonth,
    handleGoToNextMonth,
    handleGoToPreviousMonth,
    handleSelectDate,
    monthLabel: formatCalendarMonthLabel(currentMonth),
    selectedDateLabel: formatCalendarDateLabel(selectedDateKey),
    selectedDayTotal,
    selectedExpenses,
    stats,
    weekDays: getCalendarWeekDays(),
  };
}
