import type {
  CalendarCell,
  CalendarMockData,
  SelectedExpense,
} from "@/features/calendar/domain/calendar";

/** 月間カレンダーに表示する曜日ラベル一覧。 */
const weekDays: readonly string[] = ["日", "月", "火", "水", "木", "金", "土"];

/** 月間カレンダーに表示する日付セル一覧。 */
const calendarCells: readonly CalendarCell[] = [
  { dateKey: "2026-04-26", day: 26, isCurrentMonth: false, isSelected: false },
  { dateKey: "2026-04-27", day: 27, isCurrentMonth: false, isSelected: false },
  { dateKey: "2026-04-28", day: 28, isCurrentMonth: false, isSelected: false },
  { dateKey: "2026-04-29", day: 29, isCurrentMonth: false, isSelected: false },
  { dateKey: "2026-04-30", day: 30, isCurrentMonth: false, isSelected: false },
  { dateKey: "2026-05-01", day: 1, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-02", day: 2, isCurrentMonth: true, isSelected: false },
  {
    dateKey: "2026-05-03",
    day: 3,
    expenseTotal: 620,
    isCurrentMonth: true,
    isSelected: false,
  },
  {
    dateKey: "2026-05-04",
    day: 4,
    expenseTotal: 3200,
    isCurrentMonth: true,
    isSelected: false,
  },
  { dateKey: "2026-05-05", day: 5, isCurrentMonth: true, isSelected: false },
  {
    dateKey: "2026-05-06",
    day: 6,
    endingBalance: 205920,
    expenseTotal: 2140,
    isCurrentMonth: true,
    isSelected: true,
  },
  { dateKey: "2026-05-07", day: 7, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-08", day: 8, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-09", day: 9, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-10", day: 10, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-11", day: 11, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-12", day: 12, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-13", day: 13, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-14", day: 14, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-15", day: 15, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-16", day: 16, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-17", day: 17, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-18", day: 18, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-19", day: 19, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-20", day: 20, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-21", day: 21, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-22", day: 22, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-23", day: 23, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-24", day: 24, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-25", day: 25, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-26", day: 26, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-27", day: 27, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-28", day: 28, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-29", day: 29, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-30", day: 30, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-05-31", day: 31, isCurrentMonth: true, isSelected: false },
  { dateKey: "2026-06-01", day: 1, isCurrentMonth: false, isSelected: false },
  { dateKey: "2026-06-02", day: 2, isCurrentMonth: false, isSelected: false },
  { dateKey: "2026-06-03", day: 3, isCurrentMonth: false, isSelected: false },
  { dateKey: "2026-06-04", day: 4, isCurrentMonth: false, isSelected: false },
  { dateKey: "2026-06-05", day: 5, isCurrentMonth: false, isSelected: false },
  { dateKey: "2026-06-06", day: 6, isCurrentMonth: false, isSelected: false },
];

/** 選択日カードに表示する出費一覧。 */
const selectedExpenses: readonly SelectedExpense[] = [
  { amount: 160, id: "selected-1545", time: "15:45" },
  { amount: 1200, id: "selected-1230", time: "12:30" },
  { amount: 780, id: "selected-0915", time: "09:15" },
];

/**
 * @description 月間カレンダー画面モックで利用する日別集計と選択日出費を返す。
 * @param なし
 * @returns 月間カレンダー画面モックデータ。
 * @example
 * getCalendarMockData();
 */
export const getCalendarMockData = (): CalendarMockData => ({
  calendarCells,
  selectedExpenses,
  weekDays,
});
