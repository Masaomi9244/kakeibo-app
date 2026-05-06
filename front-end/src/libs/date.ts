/**
 * 日付formatに利用するAsia/Tokyo固定のtime zone。
 */
const ASIA_TOKYO_TIME_ZONE = "Asia/Tokyo";

/**
 * 日付format結果から取り出す年月日part。
 */
type DateParts = {
  readonly day: string;
  readonly month: string;
  readonly year: string;
};

/**
 * @description 指定された日付をAsia/Tokyo基準の年月日partへ変換する。
 * @param date - 変換対象の日付。
 * @returns Asia/Tokyo基準の年月日part。
 * @example
 * getAsiaTokyoDateParts(new Date("2026-05-01T00:00:00+09:00"));
 */
const getAsiaTokyoDateParts = (date: Date): DateParts => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: ASIA_TOKYO_TIME_ZONE,
    year: "numeric",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";

  return { day, month, year };
};

/**
 * @description 指定された日付をAsia/Tokyo基準のYYYY-MM形式へ変換する。
 * @param date - 変換対象の日付。
 * @returns YYYY-MM形式の年月。
 * @example
 * formatAsiaTokyoMonth(new Date("2026-05-01T00:00:00+09:00"));
 */
export const formatAsiaTokyoMonth = (date: Date): string => {
  const parts = getAsiaTokyoDateParts(date);

  return `${parts.year}-${parts.month}`;
};

/**
 * @description 指定された日付をAsia/Tokyo基準のYYYY-MM-DD形式へ変換する。
 * @param date - 変換対象の日付。
 * @returns YYYY-MM-DD形式の日付。
 * @example
 * formatAsiaTokyoDate(new Date("2026-05-01T00:00:00+09:00"));
 */
export const formatAsiaTokyoDate = (date: Date): string => {
  const parts = getAsiaTokyoDateParts(date);

  return `${parts.year}-${parts.month}-${parts.day}`;
};

/**
 * @description ISO日時文字列をAsia/Tokyo基準のHH:mm形式へ変換する。
 * @param isoDateTime - APIから受け取ったISO日時文字列。
 * @returns HH:mm形式の時刻。
 * @example
 * formatAsiaTokyoTime("2026-05-01T10:30:00+09:00");
 */
export const formatAsiaTokyoTime = (isoDateTime: string): string =>
  new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    timeZone: ASIA_TOKYO_TIME_ZONE,
  }).format(new Date(isoDateTime));
