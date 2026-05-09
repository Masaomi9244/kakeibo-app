import { useMemo, useState } from "react";

import type {
  CalendarCell,
  CalendarMonthStats,
  SelectedExpense,
} from "@/features/calendar/domain/calendar";

import { calculateCalendarMonthStats } from "@/features/calendar/usecases/calculateCalendarMonthStats";
import { formatCalendarDateLabel } from "@/features/calendar/usecases/formatCalendarDateLabel";
import { getCalendarMockData } from "@/features/calendar/usecases/getCalendarMockData";

/**
 * カレンダー画面templateへ渡すview model。
 */
export type CalendarPageViewModel = {
  /** カレンダーセル一覧 */
  readonly calendarCells: readonly CalendarCell[];
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
  /** 月間カレンダー画面に表示するモックデータ */
  const calendarMockData = useMemo(() => getCalendarMockData(), []);
  /** 選択中の日付キー */
  const [selectedDateKey, setSelectedDateKey] = useState("2026-05-06");
  /** カレンダーセル一覧 */
  const calendarCells = calendarMockData.calendarCells.map((cell) => ({
    ...cell,
    isSelected: cell.dateKey === selectedDateKey,
  }));
  /** 選択日の出費一覧 */
  const selectedExpenses =
    selectedDateKey === "2026-05-06" ? calendarMockData.selectedExpenses : [];
  /** 選択日の出費合計 */
  const selectedDayTotal = selectedExpenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );
  /** 月間カレンダー下部に表示する月次集計 */
  const stats = calculateCalendarMonthStats({
    calendarCells,
    dailySpendingGuide: 7090,
  });

  /**
   * @description カレンダーの日付選択状態を更新する。
   * @param dateKey - YYYY-MM-DD形式の日付キー。
   * @returns なし。
   * @example
   * handleSelectDate("2026-05-06");
   */
  const handleSelectDate = (dateKey: string): void => {
    setSelectedDateKey(dateKey);
  };

  return {
    calendarCells,
    handleSelectDate,
    monthLabel: "2026年5月",
    selectedDateLabel: formatCalendarDateLabel(selectedDateKey),
    selectedDayTotal,
    selectedExpenses,
    stats,
    weekDays: calendarMockData.weekDays,
  };
}
