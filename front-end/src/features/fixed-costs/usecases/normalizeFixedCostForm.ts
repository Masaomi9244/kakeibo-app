import type { CreateFixedCostRequest } from "@/features/fixed-costs/api/fixedCostDto";
import type { FixedCostFormValues } from "@/features/fixed-costs/domain/fixedCost";

/**
 * 固定費フォーム正規化結果。
 */
export type NormalizedFixedCostForm = {
  /** APIへ送信する固定費登録または更新request */
  readonly request: CreateFixedCostRequest;
};

/**
 * @description 全角数字を半角数字へ変換する。
 * @param value - ユーザーが入力した文字列。
 * @returns 全角数字だけを半角数字へ変換した文字列。
 * @example
 * normalizeFullWidthDigits("１２０００");
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
 * normalizeAmount("12,000");
 */
const normalizeAmount = (value: string): null | number => {
  /** 全角数字、カンマ、前後空白を正規化した入力値 */
  const normalizedValue = normalizeFullWidthDigits(value).replaceAll(",", "").trim();

  if (normalizedValue === "" || !/^\d+$/.test(normalizedValue)) {
    return null;
  }

  /** 数値化した固定費金額 */
  const amount = Number(normalizedValue);

  if (!Number.isSafeInteger(amount) || amount <= 0) {
    return null;
  }

  return amount;
};

/**
 * @description 固定費フォーム入力をAPI requestへ正規化する。
 * @param values - 固定費フォームの入力値。
 * @returns API request。保存できない入力の場合はnull。
 * @example
 * normalizeFixedCostForm({ name: "家賃", amount: "80000", startMonth: "2026-05" });
 */
export const normalizeFixedCostForm = (
  values: FixedCostFormValues,
): NormalizedFixedCostForm | null => {
  /** APIまたはローカルstateへ保存できる固定費金額 */
  const amount = normalizeAmount(values.amount);
  /** 前後空白を除いた固定費名 */
  const name = values.name.trim();
  /** YYYY-MM形式の開始月 */
  const startMonthMonth = values.startMonth.trim();

  if (amount === null || name === "" || !/^\d{4}-\d{2}$/.test(startMonthMonth)) {
    return null;
  }

  return {
    request: {
      amount,
      isActive: true,
      name,
      startMonth: `${startMonthMonth}-01`,
    },
  };
};
