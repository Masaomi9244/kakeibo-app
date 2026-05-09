import type { CreateIncomeRequest } from "@/features/incomes/api/incomeDto";

/**
 * 収入フォームの入力値。
 */
export type IncomeFormValues = {
  readonly amount: string;
  readonly includedInBalance: boolean;
  readonly incomeDate: string;
  readonly memo: string;
};

/**
 * 収入フォーム正規化結果。
 */
export type NormalizedIncomeForm = {
  readonly request: CreateIncomeRequest;
};

/**
 * @description 全角数字を半角数字へ変換する。
 * @param value - ユーザーが入力した文字列。
 * @returns 全角数字だけを半角数字へ変換した文字列。
 * @example
 * normalizeFullWidthDigits("２５００００");
 */
const normalizeFullWidthDigits = (value: string): string =>
  value.replaceAll(/[０-９]/g, (character) =>
    String.fromCharCode(character.charCodeAt(0) - 0xfee0),
  );

/**
 * @description 金額入力を1円以上の整数へ正規化する。
 * @param value - ユーザーが入力した金額文字列。
 * @returns 正規化できた金額。保存できない場合はnull。
 * @example
 * normalizeAmount("250,000");
 */
const normalizeAmount = (value: string): null | number => {
  const normalizedValue = normalizeFullWidthDigits(value).replaceAll(",", "").trim();

  if (normalizedValue === "" || !/^\d+$/.test(normalizedValue)) {
    return null;
  }

  const amount = Number(normalizedValue);

  if (!Number.isSafeInteger(amount) || amount <= 0) {
    return null;
  }

  return amount;
};

/**
 * @description 収入フォーム入力をAPI requestへ正規化する。
 * @param values - 収入フォームの入力値。
 * @returns API request。保存できない入力の場合はnull。
 * @example
 * normalizeIncomeForm({ amount: "250000", incomeDate: "2026-05-25", memo: "給与", includedInBalance: true });
 */
export const normalizeIncomeForm = (
  values: IncomeFormValues,
): NormalizedIncomeForm | null => {
  const amount = normalizeAmount(values.amount);
  const incomeDate = values.incomeDate.trim();

  if (amount === null || incomeDate === "") {
    return null;
  }

  const memo = values.memo.trim();

  return {
    request: {
      amount,
      includedInBalance: values.includedInBalance,
      incomeDate,
      memo: memo === "" ? null : memo,
    },
  };
};
