/** 月間カレンダーに表示する曜日ラベル一覧。 */
const CALENDAR_WEEK_DAYS: readonly string[] = [
  "日",
  "月",
  "火",
  "水",
  "木",
  "金",
  "土",
];

/**
 * @description 月間カレンダーに表示する曜日ラベル一覧を返す。
 * @param なし。
 * @returns 日曜始まりの曜日ラベル一覧。
 * @example
 * getCalendarWeekDays();
 */
export const getCalendarWeekDays = (): readonly string[] => CALENDAR_WEEK_DAYS;
