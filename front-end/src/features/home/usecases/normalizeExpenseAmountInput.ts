/**
 * 金額入力の正規化結果。
 */
export type NormalizedExpenseAmount = {
  readonly amount: number;
};

/**
 * @description 全角数字を半角数字へ変換する。
 * @param value - ユーザーが入力した文字列。
 * @returns 全角数字だけを半角数字へ変換した文字列。
 * @example
 * normalizeFullWidthDigits("１,２００");
 */
const normalizeFullWidthDigits = (value: string): string =>
  value.replaceAll(/[０-９]/g, (character) =>
    String.fromCharCode(character.charCodeAt(0) - 0xfee0),
  );

/**
 * @description 出費入力欄の文字列を1円以上の整数へ正規化する。
 * @param value - ユーザーが入力した金額文字列。
 * @returns 正規化済みの金額。保存できない入力の場合はnull。
 * @example
 * normalizeExpenseAmountInput("1,200");
 */
export const normalizeExpenseAmountInput = (
  value: string,
): NormalizedExpenseAmount | null => {
  const normalizedValue = normalizeFullWidthDigits(value).replaceAll(",", "").trim();

  if (normalizedValue === "" || !/^\d+$/.test(normalizedValue)) {
    return null;
  }

  const amount = Number(normalizedValue);

  if (!Number.isSafeInteger(amount) || amount <= 0) {
    return null;
  }

  return { amount };
};
