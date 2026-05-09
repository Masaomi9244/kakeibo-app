/**
 * @description YYYY-MM形式の対象月を年月ラベルへ変換する。
 * @param month - YYYY-MM形式の対象月。
 * @returns 年月ラベル。
 * @example
 * formatCalendarMonthLabel("2026-05");
 */
export function formatCalendarMonthLabel(month: string): string {
  /** 対象月を構成する年と月 */
  const [year, monthText] = month.split("-");

  return `${year}年${Number(monthText)}月`;
}
