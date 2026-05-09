/**
 * @description YYYY-MM-DD形式の日付キーを年月日ラベルへ変換する。
 * @param dateKey - YYYY-MM-DD形式の日付キー。
 * @returns 年月日ラベル。
 * @example
 * formatCalendarDateLabel("2026-05-06");
 */
export function formatCalendarDateLabel(dateKey: string): string {
  /** 日付キーを構成する年、月、日 */
  const [year, month, day] = dateKey.split("-");

  return `${year}年${Number(month)}月${Number(day)}日`;
}
