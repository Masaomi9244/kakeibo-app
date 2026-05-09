/**
 * 今日使える目安の計算に必要な値。
 */
export type DailySpendingGuideInput = {
  /** YYYY-MM-DD形式の対象日 */
  readonly date: string;
  /** YYYY-MM形式の対象月 */
  readonly month: string;
  /** 今月の残り予算 */
  readonly remainingAmount: number;
};

/**
 * @description YYYY-MM形式の月文字列から年を取り出す。
 * @param month - YYYY-MM形式の対象月。
 * @returns 対象年。
 * @example
 * getYearFromMonth("2026-05");
 */
const getYearFromMonth = (month: string): number => Number(month.slice(0, 4));

/**
 * @description YYYY-MM形式の月文字列から月番号を取り出す。
 * @param month - YYYY-MM形式の対象月。
 * @returns 1から12の月番号。
 * @example
 * getMonthNumberFromMonth("2026-05");
 */
const getMonthNumberFromMonth = (month: string): number => Number(month.slice(5, 7));

/**
 * @description YYYY-MM-DD形式の日付文字列から日を取り出す。
 * @param date - YYYY-MM-DD形式の対象日。
 * @returns 1から31の日。
 * @example
 * getDayFromDate("2026-05-06");
 */
const getDayFromDate = (date: string): number => Number(date.slice(8, 10));

/**
 * @description 指定年月の月末日を取得する。
 * @param year - 対象年。
 * @param monthNumber - 1から12の月番号。
 * @returns 指定年月の月末日。
 * @example
 * getLastDayOfMonth(2026, 5);
 */
const getLastDayOfMonth = (year: number, monthNumber: number): number =>
  new Date(year, monthNumber, 0).getDate();

/**
 * @description 対象日から月末までの日数を当日込みで計算する。
 * @param input - 対象月、対象日、残額。
 * @returns 当日込みの残り日数。
 * @example
 * calculateRemainingDays({ month: "2026-05", date: "2026-05-06", remainingAmount: 1000 });
 */
const calculateRemainingDays = (input: DailySpendingGuideInput): number => {
  if (!input.date.startsWith(`${input.month}-`)) {
    return getLastDayOfMonth(
      getYearFromMonth(input.month),
      getMonthNumberFromMonth(input.month),
    );
  }

  /** 対象月の月末日 */
  const lastDay = getLastDayOfMonth(
    getYearFromMonth(input.month),
    getMonthNumberFromMonth(input.month),
  );

  return Math.max(lastDay - getDayFromDate(input.date) + 1, 1);
};

/**
 * @description 今月残り予算から今日使える目安を計算する。
 * @param input - 対象月、対象日、残額。
 * @returns 今日使える目安の金額。
 * @example
 * calculateDailySpendingGuide({ month: "2026-05", date: "2026-05-06", remainingAmount: 10000 });
 */
export const calculateDailySpendingGuide = (input: DailySpendingGuideInput): number =>
  Math.max(Math.floor(input.remainingAmount / calculateRemainingDays(input)), 0);
