const yenFormatter = new Intl.NumberFormat("ja-JP", {
  currency: "JPY",
  maximumFractionDigits: 0,
  style: "currency",
});

/**
 * @description 数値の金額を日本円表示へ変換する。
 * @param amount - 表示したい金額。
 * @returns 日本円の通貨文字列。
 * @example
 * formatYen(1200);
 */
export const formatYen = (amount: number): string => yenFormatter.format(amount);
