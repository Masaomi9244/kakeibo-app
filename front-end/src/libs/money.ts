const yenFormatter = new Intl.NumberFormat("ja-JP", {
  currency: "JPY",
  maximumFractionDigits: 0,
  style: "currency",
});

export const formatYen = (amount: number): string => yenFormatter.format(amount);
