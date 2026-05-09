import type {
  CalendarCell,
  ExpenseCalendar,
  ExpenseCalendarDay,
} from "@/features/calendar/domain/calendar";

/**
 * 0埋め対象の月日数値。
 */
type PadTargetNumber = {
  /** 0埋めしたい月または日 */
  readonly value: number;
};

/**
 * カレンダーセル生成時に扱う日付部品。
 */
type CalendarDateParts = {
  /** 日 */
  readonly day: number;
  /** 1始まりの月 */
  readonly month: number;
  /** 年 */
  readonly year: number;
};

/**
 * YYYY-MM形式の対象月から取り出した計算用年月。
 */
type ParsedCalendarMonth = {
  /** 年 */
  readonly year: number;
  /** 0始まりの月 */
  readonly zeroBasedMonth: number;
};

/**
 * @description 1桁の月日数値を2桁文字列へ変換する。
 * @param target - 0埋めしたい月または日。
 * @returns 2桁の月日文字列。
 * @example
 * padDatePart({ value: 5 });
 */
const padDatePart = (target: PadTargetNumber): string =>
  target.value.toString().padStart(2, "0");

/**
 * @description 年月日部品からYYYY-MM-DD形式の日付キーを作成する。
 * @param parts - 年月日部品。
 * @returns YYYY-MM-DD形式の日付キー。
 * @example
 * createDateKey({ year: 2026, month: 5, day: 6 });
 */
const createDateKey = (parts: CalendarDateParts): string =>
  `${parts.year}-${padDatePart({ value: parts.month })}-${padDatePart({
    value: parts.day,
  })}`;

/**
 * @description YYYY-MM形式の対象月から年と0始まりの月を取得する。
 * @param month - YYYY-MM形式の対象月。
 * @returns 年と0始まりの月。
 * @example
 * parseCalendarMonth("2026-05");
 */
const parseCalendarMonth = (month: string): ParsedCalendarMonth => {
  /** 対象月を構成する年と月文字列 */
  const [yearText, monthText] = month.split("-");

  return {
    year: Number(yearText),
    zeroBasedMonth: Number(monthText) - 1,
  };
};

/**
 * @description UTC日付からカレンダーセル用の日付部品を取得する。
 * @param date - UTC基準で生成したDate。
 * @returns カレンダーセル用の日付部品。
 * @example
 * getCalendarDateParts(new Date(Date.UTC(2026, 4, 6)));
 */
const getCalendarDateParts = (date: Date): CalendarDateParts => ({
  day: date.getUTCDate(),
  month: date.getUTCMonth() + 1,
  year: date.getUTCFullYear(),
});

/**
 * @description 対象月の日別集計を日付キーで参照できるMapへ変換する。
 * @param days - APIから取得した日別集計一覧。
 * @returns 日付キーをkeyにした日別集計Map。
 * @example
 * createCalendarDayMap([{ date: "2026-05-06", expenseTotal: 2140, remainingAmount: 205920 }]);
 */
const createCalendarDayMap = (
  days: readonly ExpenseCalendarDay[],
): ReadonlyMap<string, ExpenseCalendarDay> =>
  new Map(days.map((day) => [day.date, day]));

/**
 * @description APIの日別集計を表示用カレンダーセルへ紐づける。
 * @param expenseCalendar - APIから取得した月間カレンダー集計。
 * @param selectedDateKey - YYYY-MM-DD形式の選択日。
 * @returns 月間カレンダーに表示するセル一覧。
 * @example
 * createCalendarCells(expenseCalendar, "2026-05-06");
 */
export const createCalendarCells = (
  expenseCalendar: ExpenseCalendar,
  selectedDateKey: string,
): CalendarCell[] => {
  /** 対象月を構成する年と0始まりの月 */
  const { year, zeroBasedMonth } = parseCalendarMonth(expenseCalendar.month);
  /** 対象月1日の曜日番号 */
  const firstWeekDay = new Date(Date.UTC(year, zeroBasedMonth, 1)).getUTCDay();
  /** 対象月の日数 */
  const dayCount = new Date(Date.UTC(year, zeroBasedMonth + 1, 0)).getUTCDate();
  /** カレンダーに表示する総セル数 */
  const totalCellCount = Math.ceil((firstWeekDay + dayCount) / 7) * 7;
  /** 日付キーをkeyにした日別集計Map */
  const dayMap = createCalendarDayMap(expenseCalendar.days);

  return Array.from({ length: totalCellCount }, (_, index) => {
    /** 対象月1日からの相対日 */
    const relativeDay = index - firstWeekDay + 1;
    /** カレンダーセルの日付 */
    const date = new Date(Date.UTC(year, zeroBasedMonth, relativeDay));
    /** カレンダーセルの日付部品 */
    const dateParts = getCalendarDateParts(date);
    /** YYYY-MM-DD形式のカレンダーセル日付 */
    const dateKey = createDateKey(dateParts);
    /** APIから取得したカレンダーセル日付の日別集計 */
    const day = dayMap.get(dateKey);
    /** 表示対象月の日付か */
    const isCurrentMonth = date.getUTCMonth() === zeroBasedMonth;

    /** 表示用カレンダーセルの必須値 */
    const baseCell: CalendarCell = {
      dateKey,
      day: dateParts.day,
      isCurrentMonth,
      isSelected: dateKey === selectedDateKey,
    };
    /** 日別残額を持つ場合の追加値 */
    const endingBalancePart =
      day === undefined ? {} : { endingBalance: day.remainingAmount };
    /** 日別出費がある場合の追加値 */
    const expenseTotalPart =
      day === undefined || day.expenseTotal === 0
        ? {}
        : { expenseTotal: day.expenseTotal };

    return {
      ...baseCell,
      ...endingBalancePart,
      ...expenseTotalPart,
    };
  });
};
