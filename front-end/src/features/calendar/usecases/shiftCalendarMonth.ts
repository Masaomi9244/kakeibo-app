/**
 * @description YYYY-MM形式の対象月を指定月数だけ移動する。
 * @param month - YYYY-MM形式の対象月。
 * @param offset - 移動する月数。
 * @returns 移動後のYYYY-MM形式の対象月。
 * @example
 * shiftCalendarMonth("2026-05", -1);
 */
export const shiftCalendarMonth = (month: string, offset: number): string => {
  /** 対象月を構成する年と月 */
  const [yearText, monthText] = month.split("-");
  /** 移動後の月を表すUTC日時 */
  const shiftedDate = new Date(
    Date.UTC(Number(yearText), Number(monthText) - 1 + offset, 1),
  );
  /** 移動後の年 */
  const year = shiftedDate.getUTCFullYear();
  /** 移動後の月 */
  const shiftedMonth = (shiftedDate.getUTCMonth() + 1).toString().padStart(2, "0");

  return `${year}-${shiftedMonth}`;
};
